/**
 * WooCommerce Shipping Calculator
 * Fetches shipping methods and costs from WooCommerce
 */

export interface ShippingMethod {
  id: string;
  title: string;
  cost: number;
  enabled: boolean;
}

export interface ShippingZone {
  id: number;
  name: string;
  methods: ShippingMethod[];
}

/**
 * Get shipping zones from WooCommerce
 */
export async function getShippingZones(): Promise<ShippingZone[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY!;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    // Fetch shipping zones
    const zonesResponse = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zonesResponse.ok) {
      console.error('Failed to fetch shipping zones:', zonesResponse.statusText);
      return [];
    }

    const zones = await zonesResponse.json();
    
    // Fetch methods for each zone
    const zonesWithMethods = await Promise.all(
      zones.map(async (zone: any) => {
        const methodsResponse = await fetch(
          `${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const methods = methodsResponse.ok ? await methodsResponse.json() : [];

        return {
          id: zone.id,
          name: zone.name,
          methods: methods.map((m: any) => ({
            id: m.id,
            title: m.title,
            cost: parseFloat(m.settings?.cost?.value || '0'),
            enabled: m.enabled,
          })),
        };
      })
    );

    return zonesWithMethods;
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return [];
  }
}

/**
 * Calculate shipping cost for an order based on WooCommerce settings
 * @param subtotal Order subtotal
 * @param country Country code (default: NL)
 * @returns Shipping cost
 */
export async function calculateShipping(
  subtotal: number,
  country: string = 'NL'
): Promise<number> {
  try {
    const zones = await getShippingZones();
    
    if (zones.length === 0) {
      console.warn('No shipping zones found, using fallback');
      return 6.95;
    }
    
    // Find the appropriate shipping zone for this country
    // WooCommerce zones can have specific countries or be "Rest of the World"
    let matchingZone = zones.find(z => 
      z.name.toLowerCase().includes(country.toLowerCase()) ||
      z.name.toLowerCase().includes('netherlands') && country === 'NL' ||
      z.name.toLowerCase().includes('belgium') && country === 'BE' ||
      z.name.toLowerCase().includes('germany') && country === 'DE'
    );
    
    // If no specific zone found, try to find "Rest of World" or first zone as fallback
    if (!matchingZone) {
      matchingZone = zones.find(z => 
        z.name.toLowerCase().includes('rest') || 
        z.name.toLowerCase().includes('world')
      ) || zones[0];
    }
    
    if (!matchingZone || matchingZone.methods.length === 0) {
      console.warn('No matching zone or methods found');
      return 6.95;
    }
    
    console.log(`Using zone: ${matchingZone.name} for country: ${country}`);
    
    // Check for free shipping first (if subtotal meets threshold)
    const freeShippingMethod = matchingZone.methods.find(
      m => m.enabled && m.id === 'free_shipping'
    );
    
    if (freeShippingMethod) {
      // Check if order qualifies for free shipping
      // WooCommerce typically has a "minimum order amount" setting
      // We'll check if subtotal >= 50 (common threshold)
      // In a real implementation, this would come from the method settings
      const freeShippingThreshold = 50; // This could be fetched from WooCommerce settings
      
      if (subtotal >= freeShippingThreshold) {
        console.log('Free shipping applies (threshold met)');
        return 0;
      }
    }
    
    // Use flat rate or first enabled method
    const flatRateMethod = matchingZone.methods.find(
      m => m.enabled && m.id === 'flat_rate'
    );
    
    if (flatRateMethod && flatRateMethod.cost > 0) {
      console.log(`Using flat rate: €${flatRateMethod.cost}`);
      return flatRateMethod.cost;
    }
    
    // Use any other enabled method with a cost
    const anyEnabledMethod = matchingZone.methods.find(
      m => m.enabled && m.cost > 0
    );
    
    if (anyEnabledMethod) {
      console.log(`Using method: ${anyEnabledMethod.title} - €${anyEnabledMethod.cost}`);
      return anyEnabledMethod.cost;
    }
    
    // Fallback
    console.warn('No suitable shipping method found, using fallback');
    return 6.95;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return 6.95;
  }
}

/**
 * Get default shipping cost from WooCommerce settings
 * Returns the first flat rate method and free shipping threshold if available
 */
export async function getDefaultShippingCost(): Promise<{
  cost: number;
  freeShippingThreshold: number | null;
}> {
  try {
    const zones = await getShippingZones();
    
    if (zones.length === 0) {
      return {
        cost: 6.95,
        freeShippingThreshold: 50,
      };
    }

    // Get first enabled flat rate method from any zone
    const flatRateMethod = zones
      .flatMap(z => z.methods)
      .find(m => m.enabled && m.id === 'flat_rate' && m.cost > 0);

    // Check if any zone has free shipping enabled
    const hasFreeShipping = zones
      .flatMap(z => z.methods)
      .some(m => m.enabled && m.id === 'free_shipping');

    return {
      cost: flatRateMethod?.cost || 6.95,
      freeShippingThreshold: hasFreeShipping ? 50 : null, // Default WooCommerce threshold
    };
  } catch (error) {
    console.error('Error getting default shipping cost:', error);
    return {
      cost: 6.95,
      freeShippingThreshold: 50,
    };
  }
}

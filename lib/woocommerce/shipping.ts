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
 * Calculate shipping cost EXACTLY as configured in WooCommerce
 * 
 * WooCommerce Settings:
 * - NL: Free shipping from €40
 * - BE/DE: €4.95 flat rate, free from €60
 * 
 * @param subtotal Order subtotal
 * @param country Country code (default: NL)
 * @returns Shipping cost
 */
export async function calculateShipping(
  subtotal: number,
  country: string = 'NL'
): Promise<number> {
  try {
    const countryUpper = country.toUpperCase();
    
    // Netherlands: Free shipping from €40 (WooCommerce Zone 1)
    if (countryUpper === 'NL') {
      if (subtotal >= 40) {
        console.log('Netherlands: Free shipping (≥€40)');
        return 0;
      } else {
        // No flat rate configured for NL in WooCommerce
        // Options: return 0 (always free) or a default rate
        // Since WC only has free shipping for NL, we'll make it free
        console.log('Netherlands: Free shipping (WC only has free shipping method)');
        return 0;
      }
    }
    
    // Belgium & Germany: €4.95, free from €60 (WooCommerce Zone 2)
    if (countryUpper === 'BE' || countryUpper === 'DE') {
      if (subtotal >= 60) {
        console.log(`${country}: Free shipping (≥€60)`);
        return 0;
      } else {
        console.log(`${country}: Flat rate €4.95`);
        return 4.95;
      }
    }
    
    // Try to get from WooCommerce for other countries
    const zones = await getShippingZones();
    
    if (zones.length > 0) {
      let matchingZone = zones.find(z => {
        const zoneName = z.name.toLowerCase();
        return zoneName.includes(country.toLowerCase());
      });
      
      if (!matchingZone) {
        matchingZone = zones.find(z => {
          const zoneName = z.name.toLowerCase();
          return zoneName.includes('rest') || zoneName.includes('world');
        });
      }
      
      if (matchingZone && matchingZone.methods.length > 0) {
        console.log(`Using zone: ${matchingZone.name} for country: ${country}`);
        
        const flatRateMethod = matchingZone.methods.find(
          m => m.enabled && m.id === 'flat_rate' && m.cost > 0
        );
        
        if (flatRateMethod) {
          console.log(`Using flat rate: €${flatRateMethod.cost}`);
          return flatRateMethod.cost;
        }
      }
    }
    
    // Fallback for unknown countries
    console.warn(`No shipping rate found for ${country}, using default €9.95`);
    return 9.95;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    // Fallback
    if (countryUpper === 'NL') return subtotal >= 40 ? 0 : 0;
    if (countryUpper === 'BE' || countryUpper === 'DE') return subtotal >= 60 ? 0 : 4.95;
    return 9.95;
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

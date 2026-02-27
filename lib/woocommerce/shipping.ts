/**
 * WooCommerce Shipping Calculator
 * Fetches shipping methods and costs from WooCommerce
 */

export interface ShippingMethod {
  id: string;
  title: string;
  cost: number;
  enabled: boolean;
  minAmount?: number; // Free shipping minimum amount
}

export interface ShippingZone {
  id: number;
  name: string;
  methods: ShippingMethod[];
  countries: string[]; // List of country codes for this zone
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
    
    // Fetch methods AND locations for each zone
    const zonesWithMethods = await Promise.all(
      zones.map(async (zone: any) => {
        // Fetch methods
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

        // Fetch locations (countries for this zone)
        const locationsResponse = await fetch(
          `${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/locations`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const locations = locationsResponse.ok ? await locationsResponse.json() : [];
        const countries = locations
          .filter((l: any) => l.type === 'country')
          .map((l: any) => l.code);

        return {
          id: zone.id,
          name: zone.name,
          countries,
          methods: methods.map((m: any) => ({
            id: m.method_id,
            title: m.method_title,
            cost: parseFloat(m.settings?.cost?.value || '0'),
            enabled: m.enabled,
            minAmount: m.settings?.min_amount?.value ? parseFloat(m.settings.min_amount.value) : undefined,
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
 * Calculate shipping cost dynamically from WooCommerce zones/methods
 * Automatically syncs with WooCommerce shipping settings!
 * 
 * @param subtotal Order subtotal
 * @param country Country code (default: NL)
 * @returns Shipping cost
 */
export async function calculateShipping(
  subtotal: number,
  country: string = 'NL'
): Promise<number> {
  const countryUpper = country.toUpperCase();
  
  try {
    // Try to get real-time rates from WooCommerce
    const zones = await getShippingZones();
    
    if (zones.length === 0) {
      console.warn('⚠️  No zones found, using fallback rates');
      return getFallbackShippingCost(subtotal, countryUpper);
    }
    
    // Find zone that includes this country
    let matchingZone = zones.find(z => 
      z.countries.includes(countryUpper) || 
      z.countries.includes(country.toLowerCase())
    );
    
    // If no match by country code, try zone name matching
    if (!matchingZone) {
      matchingZone = zones.find(z => {
        const zoneName = z.name.toLowerCase();
        return (
          (zoneName.includes('nederland') && countryUpper === 'NL') ||
          (zoneName.includes('netherlands') && countryUpper === 'NL') ||
          (zoneName.includes('belgie') && countryUpper === 'BE') ||
          (zoneName.includes('belgium') && countryUpper === 'BE') ||
          (zoneName.includes('duitsland') && countryUpper === 'DE') ||
          (zoneName.includes('germany') && countryUpper === 'DE')
        );
      });
    }
    
    // Fallback to "Rest of World" zone or first zone
    if (!matchingZone) {
      matchingZone = zones.find(z => 
        z.name.toLowerCase().includes('rest') || 
        z.name.toLowerCase().includes('world')
      ) || zones[0];
    }
    
    if (!matchingZone || matchingZone.methods.length === 0) {
      console.warn('⚠️  No matching zone found, using fallback');
      return getFallbackShippingCost(subtotal, countryUpper);
    }
    
    console.log(`✅ Using zone: "${matchingZone.name}" for ${country}`);
    
    // 1. Check for free shipping method first
    const freeShippingMethod = matchingZone.methods.find(
      m => m.enabled && m.id === 'free_shipping'
    );
    
    if (freeShippingMethod && freeShippingMethod.minAmount) {
      if (subtotal >= freeShippingMethod.minAmount) {
        console.log(`✅ Free shipping applies (≥€${freeShippingMethod.minAmount})`);
        return 0;
      }
    }
    
    // 2. Use flat rate method
    const flatRateMethod = matchingZone.methods.find(
      m => m.enabled && m.id === 'flat_rate'
    );
    
    if (flatRateMethod) {
      console.log(`✅ Using flat rate: €${flatRateMethod.cost}`);
      return flatRateMethod.cost;
    }
    
    // 3. Use any other enabled method with a cost
    const anyMethod = matchingZone.methods.find(m => m.enabled);
    if (anyMethod) {
      console.log(`✅ Using method: ${anyMethod.title} - €${anyMethod.cost}`);
      return anyMethod.cost;
    }
    
    // No enabled methods found
    console.warn('⚠️  No enabled methods in zone, using fallback');
    return getFallbackShippingCost(subtotal, countryUpper);
    
  } catch (error) {
    console.error('❌ Error fetching from WooCommerce:', error);
    // Use fallback on error
    return getFallbackShippingCost(subtotal, countryUpper);
  }
}

/**
 * Fallback shipping costs (used when WooCommerce API fails)
 * Based on current WooCommerce settings as of 2026-02-26
 */
function getFallbackShippingCost(subtotal: number, country: string): number {
  const countryUpper = country.toUpperCase();
  
  // Netherlands: Free from €40
  if (countryUpper === 'NL') {
    return subtotal >= 40 ? 0 : 0; // NL only has free shipping in WC
  }
  
  // Belgium & Germany: €4.95, free from €60
  if (countryUpper === 'BE' || countryUpper === 'DE') {
    return subtotal >= 60 ? 0 : 4.95;
  }
  
  // Default for other countries
  return 9.95;
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

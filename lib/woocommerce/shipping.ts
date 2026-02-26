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
 * Calculate shipping cost for an order
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
    
    // Free shipping threshold (from WooCommerce settings, typically €50)
    const FREE_SHIPPING_THRESHOLD = 50;
    
    // Country-specific shipping costs
    const COUNTRY_SHIPPING: Record<string, number> = {
      'NL': 6.95,  // Netherlands
      'BE': 8.95,  // Belgium
      'DE': 9.95,  // Germany
    };
    
    // Check if order qualifies for free shipping
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0; // Free shipping above threshold
    }
    
    // Get country-specific shipping cost
    const countryCost = COUNTRY_SHIPPING[country.toUpperCase()];
    if (countryCost) {
      return countryCost;
    }
    
    // Try to get from WooCommerce zones
    for (const zone of zones) {
      const flatRateMethod = zone.methods.find(m => m.enabled && m.id === 'flat_rate');
      if (flatRateMethod && flatRateMethod.cost > 0) {
        return flatRateMethod.cost;
      }
    }
    
    // Fallback to default Netherlands shipping
    return 6.95;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    // Fallback to default
    return 6.95;
  }
}

/**
 * Get default shipping cost from WooCommerce settings
 * This is used as a fallback if zones/methods can't be fetched
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

    // Get first enabled flat rate method
    const flatRateMethod = zones
      .flatMap(z => z.methods)
      .find(m => m.enabled && (m.id === 'flat_rate' || m.cost > 0));

    // Check if there's a free shipping method
    const freeShippingMethod = zones
      .flatMap(z => z.methods)
      .find(m => m.enabled && m.id === 'free_shipping');

    return {
      cost: flatRateMethod?.cost || 6.95,
      freeShippingThreshold: freeShippingMethod ? 50 : null, // WooCommerce default
    };
  } catch (error) {
    console.error('Error getting default shipping cost:', error);
    return {
      cost: 6.95,
      freeShippingThreshold: 50,
    };
  }
}

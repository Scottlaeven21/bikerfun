/**
 * WooCommerce shipping rates for NL / BE (and other zones).
 * Nightly/admin sync stores them in Supabase so checkout stays in sync
 * even if the WooCommerce API is slow or down.
 */

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { ShippingRate } from '@/types/database';

export interface ShippingMethod {
  id: string;
  title: string;
  cost: number;
  enabled: boolean;
  minAmount?: number;
  requires?: string;
}

export interface ShippingZone {
  id: number;
  name: string;
  methods: ShippingMethod[];
  countries: string[];
}

export interface CountryShippingInfo {
  country: string;
  cost: number;
  freeMin: number | null;
  alwaysFree: boolean;
  zoneName: string | null;
}

function wcAuthHeader(): string | null {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!key || !secret) return null;
  return `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`;
}

function parseMoney(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function settingValue(settings: any, key: string): unknown {
  const field = settings?.[key];
  if (field && typeof field === 'object' && 'value' in field) return field.value;
  return field;
}

function countriesFromZoneName(name: string): string[] {
  const zoneName = name.toLowerCase();
  const countries: string[] = [];
  if (zoneName.includes('nederland') || zoneName.includes('netherlands')) countries.push('NL');
  if (zoneName.includes('belg')) countries.push('BE');
  if (zoneName.includes('duitsland') || zoneName.includes('germany') || zoneName.includes('deutsch')) {
    countries.push('DE');
  }
  return countries;
}

function flattenZone(zone: ShippingZone): Omit<ShippingRate, 'id' | 'synced_at' | 'updated_at'> {
  const free = zone.methods.find((m) => m.enabled && m.id === 'free_shipping');
  const flat = zone.methods.find((m) => m.enabled && m.id === 'flat_rate');
  const requires = (free?.requires || '').toLowerCase();
  const alwaysFree = Boolean(
    free && !free.minAmount && (requires === '' || requires === 'coupon')
  );

  return {
    woo_zone_id: zone.id,
    name: zone.name,
    countries: zone.countries.length > 0 ? zone.countries : countriesFromZoneName(zone.name),
    flat_rate: flat?.cost ?? null,
    free_min: free?.minAmount ?? null,
    always_free: alwaysFree || Boolean(free && !flat),
    method_title: flat?.title || free?.title || null,
  };
}

function findRateForCountry(rates: ShippingRate[], country: string): ShippingRate | null {
  const code = country.toUpperCase();
  const byCountry = rates.find((r) => r.countries.map((c) => c.toUpperCase()).includes(code));
  if (byCountry) return byCountry;

  return (
    rates.find((r) => countriesFromZoneName(r.name).includes(code)) ||
    null
  );
}

function costFromRate(rate: ShippingRate, subtotal: number, country: string): number {
  if (rate.always_free) return 0;
  if (rate.free_min !== null && subtotal >= Number(rate.free_min)) return 0;
  if (rate.flat_rate !== null) return Number(rate.flat_rate);
  return getFallbackShippingCost(subtotal, country);
}

export async function getShippingZones(): Promise<ShippingZone[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const auth = wcAuthHeader();
  if (!baseUrl || !auth) return [];

  try {
    const zonesResponse = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones`, {
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!zonesResponse.ok) {
      console.error('Failed to fetch shipping zones:', zonesResponse.statusText);
      return [];
    }

    const zones = await zonesResponse.json();

    const zonesWithMethods = await Promise.all(
      zones.map(async (zone: any) => {
        const [methodsResponse, locationsResponse] = await Promise.all([
          fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`, {
            headers: { Authorization: auth, 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
          }),
          fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/locations`, {
            headers: { Authorization: auth, 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(8000),
          }),
        ]);

        const methods = methodsResponse.ok ? await methodsResponse.json() : [];
        const locations = locationsResponse.ok ? await locationsResponse.json() : [];
        const countries = (Array.isArray(locations) ? locations : [])
          .filter((l: any) => l.type === 'country')
          .map((l: any) => String(l.code).toUpperCase());

        return {
          id: zone.id,
          name: zone.name,
          countries: countries.length > 0 ? countries : countriesFromZoneName(zone.name),
          methods: (Array.isArray(methods) ? methods : []).map((m: any) => ({
            id: m.method_id,
            title: m.method_title,
            cost: parseMoney(settingValue(m.settings, 'cost')) ?? 0,
            enabled: Boolean(m.enabled),
            minAmount: parseMoney(settingValue(m.settings, 'min_amount')) ?? undefined,
            requires: String(settingValue(m.settings, 'requires') ?? ''),
          })),
        } satisfies ShippingZone;
      })
    );

    return zonesWithMethods.filter((z) => z.id !== 0);
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return [];
  }
}

export async function syncShippingRates(supabase: any): Promise<{
  synced: number;
  failed: number;
}> {
  console.log('🚚 Syncing shipping rates from WooCommerce...');
  const zones = await getShippingZones();
  if (zones.length === 0) {
    throw new Error('Geen WooCommerce-verzendzones gevonden');
  }

  const rows = zones.map((zone) => ({
    ...flattenZone(zone),
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('shipping_rates').upsert(rows, {
    onConflict: 'woo_zone_id',
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log(`✅ Synced ${rows.length} shipping zones`);
  return { synced: rows.length, failed: 0 };
}

async function fetchSyncedRates(): Promise<ShippingRate[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('dummy')) return [];

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .order('woo_zone_id');
    if (error || !data) return [];
    return data as ShippingRate[];
  } catch {
    return [];
  }
}

const getCachedSyncedRates = unstable_cache(
  fetchSyncedRates,
  ['shipping-rates'],
  { revalidate: 300, tags: ['shipping-rates'] }
);

async function getEffectiveRates(): Promise<ShippingRate[]> {
  const stored = await getCachedSyncedRates();
  if (stored.length > 0) return stored;

  const zones = await getShippingZones();
  if (zones.length === 0) return [];

  return zones.map((zone) => ({
    id: String(zone.id),
    ...flattenZone(zone),
    synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export async function calculateShipping(
  subtotal: number,
  country: string = 'NL'
): Promise<number> {
  const countryUpper = country.toUpperCase();

  try {
    const rates = await getEffectiveRates();
    const rate = findRateForCountry(rates, countryUpper);
    if (rate) {
      return costFromRate(rate, subtotal, countryUpper);
    }
    console.warn('⚠️  No matching shipping rate, using fallback');
    return getFallbackShippingCost(subtotal, countryUpper);
  } catch (error) {
    console.error('❌ Error calculating shipping:', error);
    return getFallbackShippingCost(subtotal, countryUpper);
  }
}

function getFallbackShippingCost(subtotal: number, country: string): number {
  const countryUpper = country.toUpperCase();

  if (countryUpper === 'NL') {
    return 0;
  }

  if (countryUpper === 'BE' || countryUpper === 'DE') {
    return subtotal >= 60 ? 0 : 4.95;
  }

  return 9.95;
}

export async function getDefaultShippingCost(): Promise<{
  cost: number;
  freeShippingThreshold: number | null;
}> {
  const info = await getCountryShippingInfo('NL');
  return {
    cost: info.alwaysFree ? 0 : info.cost,
    freeShippingThreshold: info.freeMin,
  };
}

export async function getCountryShippingInfo(country: string): Promise<CountryShippingInfo> {
  const code = country.toUpperCase();
  const rates = await getEffectiveRates();
  const rate = findRateForCountry(rates, code);

  if (!rate) {
    return {
      country: code,
      cost: getFallbackShippingCost(0, code),
      freeMin: code === 'NL' ? null : code === 'BE' || code === 'DE' ? 60 : null,
      alwaysFree: code === 'NL',
      zoneName: null,
    };
  }

  return {
    country: code,
    cost: rate.always_free ? 0 : Number(rate.flat_rate ?? 0),
    freeMin: rate.free_min !== null ? Number(rate.free_min) : null,
    alwaysFree: rate.always_free,
    zoneName: rate.name,
  };
}

export async function getShippingSummary(): Promise<{
  NL: CountryShippingInfo;
  BE: CountryShippingInfo;
  DE: CountryShippingInfo;
}> {
  const [NL, BE, DE] = await Promise.all([
    getCountryShippingInfo('NL'),
    getCountryShippingInfo('BE'),
    getCountryShippingInfo('DE'),
  ]);
  return { NL, BE, DE };
}

export function formatShippingInfo(info: CountryShippingInfo): string {
  if (info.alwaysFree || (info.cost === 0 && !info.freeMin)) {
    return 'Gratis verzending';
  }
  if (info.freeMin) {
    const base = info.cost > 0 ? `€ ${info.cost.toFixed(2)}` : 'Verzendkosten';
    return `${base}, gratis vanaf € ${info.freeMin.toFixed(2)}`;
  }
  if (info.cost > 0) {
    return `€ ${info.cost.toFixed(2)}`;
  }
  return 'Wordt berekend bij afrekenen';
}

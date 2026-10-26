/** Klantregel: binnen Nederland geen verzendkosten vanaf dit bedrag. */
export const NL_FREE_SHIPPING_MIN = 29.95;

export const SLEUTELHANGERS_PATH = '/products/sleutelhangers';

export function remainingToFreeNlShipping(subtotal: number): number {
  return Math.max(0, Math.round((NL_FREE_SHIPPING_MIN - subtotal) * 100) / 100);
}

export function formatEuro(amount: number): string {
  return `€ ${amount.toFixed(2).replace('.', ',')}`;
}

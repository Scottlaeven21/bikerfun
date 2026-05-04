import type { SupabaseClient } from '@supabase/supabase-js';
import {
  sendEmail,
  getAdminOrderNotificationRecipients,
  isEmailConfigured,
  isAdminOrderPaidNotificationEnabled,
} from '@/lib/email/client';
import { adminOrderPaidEmail } from '@/lib/email/templates';

/**
 * Eén keer na eerste succesvolle betaling: mail naar beheerder(s).
 * Geen mail naar klant (die gaat via WooCommerce na sync).
 */
export async function notifyAdminOrderPaid(
  supabase: SupabaseClient,
  orderId: string
): Promise<void> {
  if (!isEmailConfigured() || !isAdminOrderPaidNotificationEnabled()) {
    return;
  }

  const { data: order, error } = await supabase
    .from('webshop_orders')
    .select(
      `
      id,
      order_number,
      customer_email,
      billing_first_name,
      billing_last_name,
      total,
      items:webshop_order_items ( product_name, quantity, subtotal )
    `
    )
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error('notifyAdminOrderPaid: order fetch failed', error);
    return;
  }

  const items = (order.items ?? []) as Array<{
    product_name: string;
    quantity: number;
    subtotal: number | string;
  }>;

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);

  const lines = items.map((item) => ({
    name: item.product_name,
    qty: item.quantity,
    lineTotal: fmt(typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal),
  }));

  const totalNum =
    typeof order.total === 'string' ? parseFloat(order.total) : Number(order.total);

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl').replace(/\/$/, '');
  const adminOrderUrl = `${baseUrl}/admin/orders/${order.id}`;

  const { subject, html } = adminOrderPaidEmail({
    orderNumber: String(order.order_number),
    customerEmail: order.customer_email || '',
    customerName:
      `${order.billing_first_name || ''} ${order.billing_last_name || ''}`.trim() || '—',
    total: fmt(totalNum),
    lines,
    adminOrderUrl,
  });

  const recipients = getAdminOrderNotificationRecipients();
  const result = await sendEmail({
    to: recipients.length === 1 ? recipients[0] : recipients,
    subject,
    html,
  });

  if (!result.success) {
    console.error('notifyAdminOrderPaid: send failed', result.error);
  }
}

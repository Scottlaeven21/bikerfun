'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDealerSession } from '@/lib/dealer/auth';
import { notifyApplicationCreated } from '@/lib/dealer/notify';
import type { Dealer, DealerApplication } from '@/lib/dealer/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireActiveDealer() {
  const session = await getDealerSession();
  if (!session.user || !session.dealer) {
    return { error: 'Niet ingelogd als dealer.', dealer: null as Dealer | null };
  }
  return { error: null, dealer: session.dealer };
}

export async function createDealerApplication(formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const licensePlate = String(formData.get('license_plate') || '').trim().toUpperCase();
  const meldcode = String(formData.get('meldcode') || '').trim();
  const vin = String(formData.get('vin') || '').trim().toUpperCase();
  const typeApproval = String(formData.get('type_approval') || '').trim();
  const customerEmail = String(formData.get('customer_email') || '').trim();

  if (formData.get('accept_terms') !== 'on') {
    return { error: 'Ga akkoord met de voorwaarden om een aanvraag in te dienen.' };
  }
  if (!licensePlate || !meldcode || !vin || !typeApproval) {
    return { error: 'Kenteken, meldcode, framenummer en typegoedkeuring zijn verplicht.' };
  }
  if (customerEmail && !EMAIL_RE.test(customerEmail)) {
    return { error: 'Vul een geldig klant-e-mailadres in, of laat het leeg.' };
  }

  const admin = createAdminClient();
  const { data, error } = await (admin as any)
    .from('dealer_applications')
    .insert({
      dealer_id: gate.dealer.id,
      license_plate: licensePlate,
      meldcode,
      vin,
      type_approval: typeApproval,
      brand: String(formData.get('brand') || '').trim() || null,
      model: String(formData.get('model') || '').trim() || null,
      year: String(formData.get('year') || '').trim() || null,
      notes: String(formData.get('notes') || '').trim() || null,
      customer_name: String(formData.get('customer_name') || '').trim() || null,
      customer_email: customerEmail || null,
      customer_phone: String(formData.get('customer_phone') || '').trim() || null,
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('Dealer application insert failed:', error?.message);
    return { error: 'Aanvraag opslaan mislukt. Is de dealer-SQL al uitgevoerd?' };
  }

  await notifyApplicationCreated(gate.dealer, data as DealerApplication);
  revalidatePath('/dealer');
  redirect(`/dealer/aanvragen/${data.id}`);
}

export async function updateDealerCustomerEmail(applicationId: string, formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const customerEmail = String(formData.get('customer_email') || '').trim();
  const customerName = String(formData.get('customer_name') || '').trim();
  if (customerEmail && !EMAIL_RE.test(customerEmail)) {
    return { error: 'Vul een geldig e-mailadres in.' };
  }

  const admin = createAdminClient();
  const { data: existing } = await (admin as any)
    .from('dealer_applications')
    .select('id, dealer_id')
    .eq('id', applicationId)
    .eq('dealer_id', gate.dealer.id)
    .maybeSingle();

  if (!existing) return { error: 'Aanvraag niet gevonden.' };

  await (admin as any)
    .from('dealer_applications')
    .update({
      customer_email: customerEmail || null,
      customer_name: customerName || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId);

  revalidatePath(`/dealer/aanvragen/${applicationId}`);
  return { success: true };
}

export async function getDealerDocumentUrl(path: string) {
  const session = await getDealerSession();
  if (!session.user || (!session.dealer && !session.profile?.is_admin)) {
    return { url: null, error: 'Geen toegang.' };
  }

  const isTemplate = path.startsWith('templates/');
  if (
    session.dealer &&
    !session.profile?.is_admin &&
    !isTemplate &&
    !path.startsWith(`${session.dealer.id}/`)
  ) {
    return { url: null, error: 'Geen toegang tot dit bestand.' };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from('dealer-documents').createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    return { url: null, error: 'Bestand niet gevonden.' };
  }
  return { url: data.signedUrl };
}

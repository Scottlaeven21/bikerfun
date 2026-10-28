'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDealerSession } from '@/lib/dealer/auth';
import { notifyApplicationCreated, notifyApplicationStatus } from '@/lib/dealer/notify';
import type { Dealer, DealerApplication } from '@/lib/dealer/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FORM_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FORM_BYTES = 12 * 1024 * 1024;

async function requireActiveDealer() {
  const session = await getDealerSession();
  if (!session.user || !session.dealer) {
    return { error: 'Niet ingelogd als dealer.', dealer: null as Dealer | null };
  }
  if (session.dealer.status === 'rejected') {
    return { error: 'Dit dealeraccount is niet actief.', dealer: null as Dealer | null };
  }
  return { error: null, dealer: session.dealer };
}

export async function createDealerApplication(formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const licensePlate = String(formData.get('license_plate') || '').trim().toUpperCase();
  const meldcode = String(formData.get('meldcode') || '').trim();
  const vin = String(formData.get('vin') || '').trim().toUpperCase();
  const customerEmail = String(formData.get('customer_email') || '').trim();

  if (!licensePlate || !meldcode || !vin) {
    return { error: 'Kenteken, meldcode en framenummer zijn verplicht.' };
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

export async function uploadDealerForm(applicationId: string, formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const file = formData.get('form_file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Kies een PDF of foto van het ingevulde formulier.' };
  }
  if (file.size > MAX_FORM_BYTES) {
    return { error: 'Bestand is te groot (max 12 MB).' };
  }
  if (!ALLOWED_FORM_TYPES.includes(file.type)) {
    return { error: 'Alleen PDF, JPG of PNG.' };
  }

  const admin = createAdminClient();
  const { data: existing } = await (admin as any)
    .from('dealer_applications')
    .select('*')
    .eq('id', applicationId)
    .eq('dealer_id', gate.dealer.id)
    .maybeSingle();

  if (!existing) return { error: 'Aanvraag niet gevonden.' };

  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const path = `${gate.dealer.id}/${applicationId}/formulier-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from('dealer-documents').upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    console.error('Dealer form upload failed:', uploadError.message);
    return { error: 'Uploaden mislukt. Controleer of de storage-bucket bestaat.' };
  }

  const { data: updated } = await (admin as any)
    .from('dealer_applications')
    .update({
      form_path: path,
      form_uploaded_at: new Date().toISOString(),
      signed_form_status: 'received',
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select('*')
    .single();

  if (updated) {
    await notifyApplicationStatus(
      gate.dealer,
      updated as DealerApplication,
      updated.status,
      'received'
    );
  }

  revalidatePath(`/dealer/aanvragen/${applicationId}`);
  revalidatePath('/admin/omkeuren');
  return { success: true };
}

export async function getDealerDocumentUrl(path: string) {
  const session = await getDealerSession();
  if (!session.user || (!session.dealer && !session.profile?.is_admin)) {
    return { url: null, error: 'Geen toegang.' };
  }

  if (session.dealer && !path.startsWith(`${session.dealer.id}/`) && !session.profile?.is_admin) {
    return { url: null, error: 'Geen toegang tot dit bestand.' };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from('dealer-documents').createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) {
    return { url: null, error: 'Bestand niet gevonden.' };
  }
  return { url: data.signedUrl };
}

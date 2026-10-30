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
      type_approval: typeApproval || null,
      brand: String(formData.get('brand') || '').trim() || null,
      model: String(formData.get('model') || '').trim() || null,
      year: String(formData.get('year') || '').trim() || null,
      notes: String(formData.get('notes') || '').trim() || null,
      customer_name: String(formData.get('customer_name') || '').trim() || null,
      customer_email: customerEmail || null,
      customer_phone: String(formData.get('customer_phone') || '').trim() || null,
      proceed_on_approval: formData.get('proceed_on_approval') === 'on',
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

const MAX_SIGNED_FORM_BYTES = 12 * 1024 * 1024;

function signedFormFileMeta(file: File) {
  const name = file.name.toLowerCase();
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    return { ext: 'pdf', contentType: 'application/pdf' };
  }
  if (file.type === 'image/jpeg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) {
    return { ext: 'jpg', contentType: 'image/jpeg' };
  }
  if (file.type === 'image/png' || name.endsWith('.png')) {
    return { ext: 'png', contentType: 'image/png' };
  }
  if (file.type === 'image/webp' || name.endsWith('.webp')) {
    return { ext: 'webp', contentType: 'image/webp' };
  }
  return null;
}

export async function uploadDealerSignedForm(applicationId: string, formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const file = formData.get('signed_form');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Kies het ingevulde formulier.' };
  }
  if (file.size > MAX_SIGNED_FORM_BYTES) {
    return { error: 'Bestand is te groot (max 12 MB).' };
  }
  const meta = signedFormFileMeta(file);
  if (!meta) {
    return { error: 'Upload een PDF of foto (JPG/PNG).' };
  }

  const admin = createAdminClient();
  const { data: existing } = await (admin as any)
    .from('dealer_applications')
    .select('id, form_path')
    .eq('id', applicationId)
    .eq('dealer_id', gate.dealer.id)
    .maybeSingle();

  if (!existing) return { error: 'Aanvraag niet gevonden.' };

  const path = `${gate.dealer.id}/${applicationId}/machtiging.${meta.ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage.from('dealer-documents').upload(path, buffer, {
    contentType: meta.contentType,
    upsert: true,
  });

  if (uploadError) {
    console.error('Signed form upload failed:', uploadError.message);
    return { error: 'Uploaden mislukt. Probeer het opnieuw.' };
  }

  if (existing.form_path && existing.form_path !== path) {
    await admin.storage.from('dealer-documents').remove([existing.form_path]);
  }

  const { error } = await (admin as any)
    .from('dealer_applications')
    .update({
      form_path: path,
      form_uploaded_at: new Date().toISOString(),
      signed_form_status: 'received',
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId);

  if (error) {
    console.error('Signed form update failed:', error.message);
    return { error: 'Formulier is geüpload, maar opslaan is mislukt.' };
  }

  revalidatePath(`/dealer/aanvragen/${applicationId}`);
  revalidatePath('/admin/omkeuren');
  revalidatePath(`/admin/omkeuren/${applicationId}`);
  return { success: true };
}

export async function updateDealerEmailPreference(formData: FormData) {
  const gate = await requireActiveDealer();
  if (!gate.dealer) return { error: gate.error || 'Geen dealer gevonden.' };

  const value = String(formData.get('email_updates') || '').trim();
  if (value !== 'all' && value !== 'action' && value !== 'none') {
    return { error: 'Kies een geldige mailvoorkeur.' };
  }

  const admin = createAdminClient();
  const { error } = await (admin as any)
    .from('dealers')
    .update({
      email_updates: value,
      updated_at: new Date().toISOString(),
    })
    .eq('id', gate.dealer.id);

  if (error) {
    console.error('Dealer email preference update failed:', error.message);
    return { error: 'Voorkeur opslaan is mislukt. Is de SQL al uitgevoerd?' };
  }

  revalidatePath('/dealer');
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

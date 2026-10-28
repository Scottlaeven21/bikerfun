'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDealerSession } from '@/lib/dealer/auth';
import { notifyApplicationStatus } from '@/lib/dealer/notify';
import {
  canSubmitToRdw,
  isApplicationStatus,
  nextSignedFormStatus,
  type SignedFormStatus,
} from '@/lib/dealer/status';
import type { Dealer, DealerApplication } from '@/lib/dealer/types';

async function requireAdmin() {
  const session = await getDealerSession();
  if (!session.user || !session.profile?.is_admin) {
    return { error: 'Geen admin.', session: null };
  }
  return { error: null, session };
}

async function removeDealerDocuments(dealerId: string) {
  const admin = createAdminClient();
  const bucket = admin.storage.from('dealer-documents');
  const paths: string[] = [];

  async function walk(prefix: string) {
    const { data } = await bucket.list(prefix, { limit: 1000 });
    if (!data?.length) return;
    for (const item of data) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id) {
        await walk(full);
      } else {
        paths.push(full);
      }
    }
  }

  await walk(dealerId);
  if (paths.length) {
    await bucket.remove(paths);
  }
}

export async function deleteDealer(dealerId: string) {
  const gate = await requireAdmin();
  if (gate.error || !gate.session?.user) return { error: gate.error || 'Geen admin.' };

  if (!dealerId) return { error: 'Geen dealer.' };

  const admin = createAdminClient();
  const { data: dealer } = await (admin as any)
    .from('dealers')
    .select('id, user_id, company_name')
    .eq('id', dealerId)
    .maybeSingle();

  if (!dealer) return { error: 'Dealer niet gevonden.' };
  if (dealer.user_id === gate.session.user.id) {
    return { error: 'Je kunt je eigen account niet verwijderen.' };
  }

  const { data: profile } = await (admin as any)
    .from('profiles')
    .select('is_admin')
    .eq('id', dealer.user_id)
    .maybeSingle();

  await removeDealerDocuments(dealerId);

  const { error } = await (admin as any).from('dealers').delete().eq('id', dealerId);
  if (error) {
    console.error('Dealer delete failed:', error.message);
    return { error: 'Dealer verwijderen mislukt.' };
  }

  if (profile?.is_admin) {
    await (admin as any)
      .from('profiles')
      .update({ is_dealer: false, updated_at: new Date().toISOString() })
      .eq('id', dealer.user_id);
  } else if (dealer.user_id) {
    const { error: userError } = await admin.auth.admin.deleteUser(dealer.user_id);
    if (userError) {
      await (admin as any)
        .from('profiles')
        .update({ is_dealer: false, updated_at: new Date().toISOString() })
        .eq('id', dealer.user_id);
      console.error('Dealer user delete failed:', userError.message);
    }
  }

  revalidatePath('/admin/dealers');
  revalidatePath('/admin/omkeuren');
  revalidatePath('/dealer');
  redirect('/admin/dealers');
}

export async function setApplicationWorkflow(applicationId: string, formData: FormData) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const status = String(formData.get('status') || '');
  const signedForm = String(formData.get('signed_form_status') || '') as SignedFormStatus;
  if (!isApplicationStatus(status)) return { error: 'Ongeldige status.' };
  if (!['none', 'waiting', 'received'].includes(signedForm)) {
    return { error: 'Ongeldige formulierstatus.' };
  }

  const admin = createAdminClient();
  const { data: existing } = await (admin as any)
    .from('dealer_applications')
    .select('*, dealers(*)')
    .eq('id', applicationId)
    .maybeSingle();

  if (!existing) return { error: 'Aanvraag niet gevonden.' };

  let nextForm = signedForm;
  if (existing.form_path) nextForm = 'received';
  else if (status !== 'received' && nextForm === 'none') nextForm = nextSignedFormStatus(nextForm, status);

  if ((status === 'rdw_submitted' || status === 'completed') && !canSubmitToRdw(nextForm)) {
    return { error: 'Eerst het ondertekende formulier nodig voordat we bij de RDW indienen of afronden.' };
  }

  const { data: updated, error } = await (admin as any)
    .from('dealer_applications')
    .update({
      status,
      signed_form_status: nextForm,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error || !updated) return { error: 'Status opslaan mislukt.' };

  const dealer = existing.dealers as Dealer | null;
  if (dealer) {
    await notifyApplicationStatus(dealer, updated as DealerApplication, status, nextForm);
  }

  revalidatePath('/admin/omkeuren');
  revalidatePath(`/admin/omkeuren/${applicationId}`);
  revalidatePath('/dealer');
  return { success: true };
}

const MAX_INVOICE_PDF_BYTES = 12 * 1024 * 1024;

export async function createDealerInvoice(formData: FormData) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const dealerId = String(formData.get('dealer_id') || '');
  const description = String(formData.get('description') || '').trim();
  const amount = Number(String(formData.get('amount') || '').replace(',', '.'));
  const applicationId = String(formData.get('application_id') || '').trim();
  const dueDate = String(formData.get('due_date') || '').trim();
  const file = formData.get('invoice_pdf');

  if (!dealerId || !description || !Number.isFinite(amount) || amount < 0 || !dueDate) {
    return { error: 'Vul omschrijving, bedrag en datum in.' };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Upload de factuur-PDF.' };
  }
  if (file.size > MAX_INVOICE_PDF_BYTES) {
    return { error: 'PDF is te groot (max 12 MB).' };
  }
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return { error: 'De factuur moet een PDF zijn.' };
  }

  const admin = createAdminClient();
  const invoiceId = crypto.randomUUID();
  const path = `${dealerId}/invoices/${invoiceId}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage.from('dealer-documents').upload(path, buffer, {
    contentType: 'application/pdf',
    upsert: true,
  });

  if (uploadError) {
    console.error('Invoice PDF upload failed:', uploadError.message);
    return { error: 'PDF uploaden mislukt. Controleer of de storage-bucket bestaat.' };
  }

  const { error } = await (admin as any).from('dealer_invoices').insert({
    id: invoiceId,
    dealer_id: dealerId,
    application_id: applicationId || null,
    description,
    amount,
    due_date: dueDate,
    pdf_path: path,
  });

  if (error) {
    console.error('Invoice insert failed:', error.message);
    return { error: 'Factuur opslaan mislukt.' };
  }

  revalidatePath('/admin/dealers');
  revalidatePath(`/admin/dealers/${dealerId}`);
  if (applicationId) revalidatePath(`/admin/omkeuren/${applicationId}`);
  revalidatePath('/dealer/facturen');
  return { success: true };
}

export async function setDealerInvoicePaid(invoiceId: string, paid: boolean) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const admin = createAdminClient();
  const { error } = await (admin as any)
    .from('dealer_invoices')
    .update({
      status: paid ? 'paid' : 'open',
      paid_at: paid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (error) return { error: 'Factuur bijwerken mislukt.' };
  revalidatePath('/admin/dealers');
  revalidatePath('/dealer/facturen');
  return { success: true };
}

export async function createAdminFromAdmin(formData: FormData) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  if (!name || !email) {
    return { error: 'Vul naam en e-mail in.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Vul een geldig e-mailadres in.' };
  }

  const { provisionAdminAccount } = await import('@/lib/auth/provision-admin');
  const result = await provisionAdminAccount(name, email);
  if (!result.ok) {
    return { error: result.error || 'Admin aanmaken mislukt.' };
  }

  revalidatePath('/admin');
  return {
    success: true,
    createdUser: result.createdUser,
    alreadyExisted: result.alreadyExisted,
    password: result.password,
    emailed: result.emailed,
  };
}

export async function createDealerFromAdmin(formData: FormData) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const company = String(formData.get('company') || '').trim();
  const phone = String(formData.get('phone') || '').trim();

  if (!name || !email || !company) {
    return { error: 'Vul contactpersoon, e-mail en bedrijfsnaam in.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Vul een geldig e-mailadres in.' };
  }

  const { provisionDealerFromSignup } = await import('@/lib/dealer/provision');
  const result = await provisionDealerFromSignup({
    name,
    email,
    company,
    phone,
    location: String(formData.get('location') || '').trim() || undefined,
    kvk: String(formData.get('kvk') || '').trim() || undefined,
  });

  if (!result.ok) {
    return { error: result.error || 'Dealer aanmaken mislukt. Is de SQL al uitgevoerd?' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/dealers');
  return {
    success: true,
    dealerId: result.dealerId,
    createdUser: result.createdUser,
    alreadyExisted: result.alreadyExisted,
  };
}

export async function uploadDealerFormTemplate(formData: FormData) {
  const gate = await requireAdmin();
  if (gate.error) return { error: gate.error };

  const file = formData.get('template_file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Kies een PDF.' };
  }
  if (file.type !== 'application/pdf') {
    return { error: 'Het sjabloon moet een PDF zijn.' };
  }

  const admin = createAdminClient();
  const path = `templates/omkeur-formulier.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from('dealer-documents').upload(path, buffer, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (error) return { error: 'Upload mislukt.' };

  await (admin as any)
    .from('dealer_portal_settings')
    .upsert({ id: 1, form_path: path, updated_at: new Date().toISOString() });

  revalidatePath('/admin/omkeuren');
  revalidatePath('/dealer/formulier');
  return { success: true };
}

import type {
  ApplicationStatus,
  DealerAccountStatus,
  InvoiceStatus,
  SignedFormStatus,
} from './status';

export type Dealer = {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  kvk: string | null;
  vat_number: string | null;
  rdw_recognized: string | null;
  has_workshop: string | null;
  estimated_omkeuren: string | null;
  notes: string | null;
  status: DealerAccountStatus;
  created_at: string;
  updated_at: string;
};

export type DealerApplication = {
  id: string;
  dealer_id: string;
  license_plate: string;
  meldcode: string;
  vin: string;
  brand: string | null;
  model: string | null;
  year: string | null;
  notes: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: ApplicationStatus;
  signed_form_status: SignedFormStatus;
  form_path: string | null;
  form_uploaded_at: string | null;
  created_at: string;
  updated_at: string;
  dealers?: Pick<Dealer, 'company_name' | 'email' | 'contact_name' | 'phone'> | null;
};

export type DealerInvoice = {
  id: string;
  dealer_id: string;
  application_id: string | null;
  description: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

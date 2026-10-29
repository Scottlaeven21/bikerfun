import {
  APPLICATION_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
  type ApplicationStatus,
  type InvoiceStatus,
} from '@/lib/dealer/status';

const statusClass: Record<ApplicationStatus, string> = {
  received: 'bg-gray-100 text-gray-800',
  approved: 'bg-emerald-50 text-emerald-800',
  docs_requested: 'bg-amber-50 text-amber-800',
  awaiting_delivery: 'bg-sky-50 text-sky-800',
  rdw_submitted: 'bg-indigo-50 text-indigo-800',
  completed: 'bg-biker-yellow/20 text-biker-black',
  not_possible: 'bg-red-50 text-red-700',
  invoiced: 'bg-orange-50 text-orange-800',
  paid: 'bg-emerald-50 text-emerald-800',
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusClass[status]}`}>
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        status === 'paid'
          ? 'bg-emerald-50 text-emerald-800'
          : status === 'partial'
            ? 'bg-orange-50 text-orange-800'
            : 'bg-red-50 text-red-700'
      }`}
    >
      {INVOICE_STATUS_LABELS[status]}
    </span>
  );
}

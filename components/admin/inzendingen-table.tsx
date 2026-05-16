'use client';

import { useState, Fragment, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { deleteFormSubmission } from '@/app/actions/inzendingen';

const URGENCY_LABELS: Record<string, string> = {
  asap: 'Zo snel mogelijk',
  '1-month': 'Binnen 1 maand',
  '3-months': 'Binnen 3 maanden',
  flexible: 'Geen haast, perfecte match belangrijker',
};

interface FormSubmission {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  motor_details?: Record<string, unknown>;
  page_path?: string;
  created_at: string;
}

interface InzendingenTableProps {
  submissions: FormSubmission[];
  type: 'contact' | 'motor_aanvraag' | 'bezichtiging';
  columns: string[];
}

function renderRowCells(sub: FormSubmission, type: 'contact' | 'motor_aanvraag' | 'bezichtiging') {
  const motor = sub.motor_details as { brand?: string; model?: string } | null;
  const motorStr = motor ? `${motor.brand || ''} ${motor.model || ''}`.trim() : '-';

  const base = (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <a href={`mailto:${sub.email}`} className="text-biker-yellow hover:underline">{sub.email}</a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || '-'}</td>
    </>
  );

  if (type === 'contact') {
    return (
      <>
        {base}
        <td className="px-6 py-4 text-sm text-gray-600">{sub.subject || '-'}</td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
          <span className="line-clamp-2">{sub.message}</span>
        </td>
      </>
    );
  }

  if (type === 'bezichtiging') {
    return (
      <>
        {base}
        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{motorStr}</td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
          <span className="line-clamp-2">{sub.message}</span>
        </td>
      </>
    );
  }

  return (
    <>
      {base}
      <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
        <span className="line-clamp-2">{sub.message}</span>
      </td>
    </>
  );
}

export function InzendingenTable({ submissions, type, columns }: InzendingenTableProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (sub: FormSubmission) => {
    const label = sub.name ? `de inzending van ${sub.name}` : 'deze inzending';
    if (!confirm(`Weet je zeker dat je ${label} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      return;
    }

    setDeleteError(null);
    setDeletingId(sub.id);

    startTransition(async () => {
      const result = await deleteFormSubmission(sub.id);
      if (!result.success) {
        setDeleteError(result.error || 'Verwijderen mislukt');
        setDeletingId(null);
        return;
      }

      if (expandedId === sub.id) {
        setExpandedId(null);
      }
      setDeletingId(null);
      router.refresh();
    });
  };

  const getSubmissionDetail = (sub: FormSubmission) => {
    const motor = sub.motor_details as Record<string, unknown> | null;
    const base = [
      { label: 'Naam', value: sub.name },
      { label: 'Email', value: sub.email },
      { label: 'Telefoon', value: sub.phone || '-' },
      { label: 'Datum', value: format(new Date(sub.created_at), 'dd MMMM yyyy HH:mm', { locale: nl }) },
      { label: 'Bericht', value: sub.message },
    ];

    if (type === 'contact' && sub.subject) {
      base.splice(4, 0, { label: 'Onderwerp', value: sub.subject });
    }

    if ((type === 'motor_aanvraag' || type === 'bezichtiging') && motor) {
      const motorFields = [
        { key: 'brand', label: 'Merk' },
        { key: 'model', label: 'Model' },
        { key: 'year_from', label: 'Bouwjaar vanaf' },
        { key: 'year_to', label: 'Bouwjaar tot' },
        { key: 'mileage_max', label: 'Max km-stand' },
        { key: 'budget', label: 'Budget' },
        { key: 'color', label: 'Kleur' },
        { key: 'location', label: 'Woonplaats' },
        { key: 'urgency', label: 'Urgentie' },
        { key: 'additional_info', label: 'Opmerkingen' },
        { key: 'price', label: 'Prijs' },
        { key: 'occasionUrl', label: 'Occasion link' },
      ];
      motorFields.forEach(({ key, label }) => {
        const val = motor[key];
        if (val !== undefined && val !== null && val !== '') {
          const displayVal = key === 'urgency' && URGENCY_LABELS[String(val)]
            ? URGENCY_LABELS[String(val)]
            : String(val);
          base.push({ label, value: displayVal });
        }
      });
    }

    if (sub.page_path) {
      base.push({ label: 'Pagina', value: sub.page_path });
    }

    return base;
  };

  return (
    <div className="overflow-x-auto">
      {deleteError && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {deleteError}
        </div>
      )}
      {submissions.length === 0 ? (
        <div className="p-12 text-center text-gray-500">Nog geen inzendingen</div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {col}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-40">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <Fragment key={sub.id}>
                <tr
                  key={sub.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(sub.id)}
                >
                  {renderRowCells(sub, type)}
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(sub.id)}
                        className="px-3 py-1.5 bg-biker-yellow text-biker-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        {expandedId === sub.id ? 'Sluiten' : 'Bekijk'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub)}
                        disabled={isPending && deletingId === sub.id}
                        title="Inzending verwijderen"
                        className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending && deletingId === sub.id ? 'Bezig…' : 'Verwijder'}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === sub.id && (
                  <tr key={`${sub.id}-detail`}>
                    <td colSpan={columns.length + 1} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-900 text-sm uppercase">Volledige inzending</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getSubmissionDetail(sub).map(({ label, value }) => (
                            <div key={label}>
                              <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
                              <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap break-words">
                                {label === 'Email' ? (
                                  <a href={`mailto:${value}`} className="text-biker-yellow hover:underline">
                                    {value}
                                  </a>
                                ) : (
                                  value
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

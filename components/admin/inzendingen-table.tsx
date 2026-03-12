'use client';

import { useState, Fragment } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

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
  renderRow: (sub: FormSubmission) => React.ReactNode;
}

export function InzendingenTable({ submissions, type, columns, renderRow }: InzendingenTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
                Actie
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
                  {renderRow(sub)}
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(sub.id)}
                      className="px-3 py-1.5 bg-biker-yellow text-biker-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      {expandedId === sub.id ? 'Sluiten' : 'Bekijk'}
                    </button>
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

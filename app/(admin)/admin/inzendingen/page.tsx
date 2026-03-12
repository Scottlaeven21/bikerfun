import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { InzendingenTable } from '@/components/admin/inzendingen-table';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InzendingenPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirect=/admin/inzendingen');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin: boolean } | null;
  if (!profile?.is_admin) {
    redirect('/');
  }

  const { data: submissions } = await (supabase as any)
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  const contactSubmissions = submissions?.filter((s: any) => s.type === 'contact') || [];
  const motorSubmissions = submissions?.filter((s: any) => s.type === 'motor_aanvraag') || [];
  const bezichtigingSubmissions = submissions?.filter((s: any) => s.type === 'bezichtiging') || [];

  const formSections = [
    {
      id: 'contact',
      title: 'Contactformulier',
      icon: (
        <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      data: contactSubmissions,
      columns: ['Datum', 'Naam', 'Email', 'Telefoon', 'Onderwerp', 'Bericht'],
      renderRow: (sub: any) => (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <a href={`mailto:${sub.email}`} className="text-biker-yellow hover:underline">{sub.email}</a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || '-'}</td>
          <td className="px-6 py-4 text-sm text-gray-600">{sub.subject || '-'}</td>
          <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
            <span className="line-clamp-2">{sub.message}</span>
          </td>
        </>
      ),
    },
    {
      id: 'bezichtiging',
      title: 'Bezichtiging inplannen',
      icon: (
        <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      data: bezichtigingSubmissions,
      columns: ['Datum', 'Naam', 'Email', 'Telefoon', 'Motor', 'Bericht'],
      renderRow: (sub: any) => {
        const motor = sub.motor_details as { brand?: string; model?: string } | null;
        const motorStr = motor ? `${motor.brand || ''} ${motor.model || ''}`.trim() : '-';
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <a href={`mailto:${sub.email}`} className="text-biker-yellow hover:underline">{sub.email}</a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{motorStr}</td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
              <span className="line-clamp-2">{sub.message}</span>
            </td>
          </>
        );
      },
    },
    {
      id: 'motor_aanvraag',
      title: 'Motor op aanvraag',
      icon: (
        <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      data: motorSubmissions,
      columns: ['Datum', 'Naam', 'Email', 'Telefoon', 'Bericht'],
      renderRow: (sub: any) => (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <a href={`mailto:${sub.email}`} className="text-biker-yellow hover:underline">{sub.email}</a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || '-'}</td>
          <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
            <span className="line-clamp-2">{sub.message}</span>
          </td>
        </>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">Inzendingen</h1>
        <p className="text-gray-600 mt-2">
          Alle formulierinzendingen per type
        </p>
      </div>

      <div className="space-y-8">
        {formSections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-biker-yellow/10 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              {section.icon}
              <span className="ml-2">{section.title} ({section.data.length})</span>
            </h2>
          </div>
          <InzendingenTable
            submissions={section.data}
            type={section.id as 'contact' | 'motor_aanvraag' | 'bezichtiging'}
            columns={section.columns}
            renderRow={section.renderRow}
          />
        </div>
        ))}
      </div>
    </div>
  );
}

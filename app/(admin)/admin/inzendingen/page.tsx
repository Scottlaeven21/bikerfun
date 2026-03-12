import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">Inzendingen</h1>
        <p className="text-gray-600 mt-2">
          Alle contactformulier en motor op aanvraag inzendingen
        </p>
      </div>

      <div className="space-y-8">
        {/* Contact form submissions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-biker-yellow/10 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactformulier ({contactSubmissions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {contactSubmissions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Nog geen contactformulier inzendingen
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Naam</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Telefoon</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Onderwerp</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Bericht</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contactSubmissions.map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Motor aanvraag submissions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-biker-yellow/10 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Motor op Aanvraag ({motorSubmissions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {motorSubmissions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Nog geen motor aanvraag inzendingen
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Naam</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Telefoon</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Motor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Bericht</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {motorSubmissions.map((sub: any) => {
                    const motor = sub.motor_details as { brand?: string; model?: string } | null;
                    const motorStr = motor ? `${motor.brand || ''} ${motor.model || ''}`.trim() : 'Algemene aanvraag';
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(sub.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a href={`mailto:${sub.email}`} className="text-biker-yellow hover:underline">{sub.email}</a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{motorStr || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md" title={sub.message}>
                          <span className="line-clamp-2">{sub.message}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

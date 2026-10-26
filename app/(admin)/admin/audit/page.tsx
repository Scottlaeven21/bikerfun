import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AuditFilters } from './audit-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

function loginTargetLabel(details: any): string | null {
  const target = details?.target;
  if (target === 'admin') return 'Admin-panel';
  if (target === 'webshop_account') return 'Webshop-account';
  if (target === 'shop') return 'Website';
  const redirect = String(details?.redirect || '');
  if (redirect.startsWith('/admin')) return 'Admin-panel';
  if (redirect.startsWith('/account') || redirect.startsWith('/dashboard')) return 'Webshop-account';
  if (redirect) return 'Website';
  return null;
}

function actionBadge(log: AuditLog) {
  if (log.action === 'login') {
    const failed = log.details?.success === false;
    return {
      label: failed ? 'Login mislukt' : 'Login gelukt',
      className: failed ? 'bg-red-600 text-white' : 'bg-green-600 text-white',
    };
  }
  if (log.action === 'create' && log.resource_type === 'user') {
    const failed = log.details?.success === false;
    return {
      label: failed ? 'Account mislukt' : 'Account aangemaakt',
      className: failed ? 'bg-red-600 text-white' : 'bg-green-600 text-white',
    };
  }
  const styles: Record<string, string> = {
    create: 'bg-green-600 text-white',
    update: 'bg-blue-600 text-white',
    delete: 'bg-red-600 text-white',
    sync: 'bg-purple-600 text-white',
    logout: 'bg-gray-500 text-white',
  };
  return {
    label: log.action,
    className: styles[log.action] || 'bg-gray-600 text-white',
  };
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; resource?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirect=/admin/audit');
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

  // Pagination
  const page = parseInt(params.page || '1');
  const perPage = 50;
  const offset = (page - 1) * perPage;

  // Build query with filters
  let query = (supabase as any)
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (params.action) {
    query = query.eq('action', params.action);
  }

  if (params.resource) {
    query = query.eq('resource_type', params.resource);
  }

  const { data: logs, count } = await query;
  const auditLogs = (logs as AuditLog[]) || [];
  const totalPages = Math.ceil((count || 0) / perPage);

  // Get unique actions and resource types for filters
  const { data: allLogsData } = await (supabase as any)
    .from('audit_logs')
    .select('action, resource_type');

  const allLogs = (allLogsData as { action: string; resource_type: string }[]) || [];
  const actions = Array.from(new Set(allLogs.map(l => l.action)));
  const resourceTypes = Array.from(new Set(allLogs.map(l => l.resource_type)));

  return (
    <div className="min-h-screen bg-biker-black pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-gray-400">
            Overzicht van alle admin acties en systeemgebeurtenissen
          </p>
        </div>

        {/* Filters */}
        <AuditFilters actions={actions} resourceTypes={resourceTypes} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
            <div className="text-gray-400 text-sm mb-1">Totaal Logs</div>
            <div className="text-3xl font-bold text-white">{count || 0}</div>
          </div>
          <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
            <div className="text-gray-400 text-sm mb-1">Unieke Gebruikers</div>
            <div className="text-3xl font-bold text-white">
              {new Set(auditLogs.map(l => l.user_email)).size}
            </div>
          </div>
          <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
            <div className="text-gray-400 text-sm mb-1">Vandaag</div>
            <div className="text-3xl font-bold text-white">
              {auditLogs.filter(l => {
                const logDate = new Date(l.created_at);
                const today = new Date();
                return logDate.toDateString() === today.toDateString();
              }).length}
            </div>
          </div>
          <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
            <div className="text-gray-400 text-sm mb-1">Laatste 24u</div>
            <div className="text-3xl font-bold text-white">
              {auditLogs.filter(l => {
                const logDate = new Date(l.created_at);
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return logDate >= oneDayAgo;
              }).length}
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-biker-dark rounded-lg border-2 border-biker-gray overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-biker-black border-b-2 border-biker-gray">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tijd
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Gebruiker
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Actie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Waar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-biker-gray">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Geen audit logs gevonden
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => {
                    const badge = actionBadge(log);
                    const target = loginTargetLabel(log.details);
                    return (
                    <tr key={log.id} className="hover:bg-biker-black transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(log.created_at).toLocaleString('nl-NL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-white font-medium">{log.user_email}</div>
                        {log.user_id && (
                          <div className="text-xs text-gray-400 font-mono">
                            {log.user_id.substring(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                        {log.details?.is_admin === true && (
                          <div className="text-xs text-biker-yellow mt-1">Admin-account</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div>
                          {target
                            || (log.action === 'login' ? 'Onbekend (oude log)' : log.resource_type)}
                        </div>
                        {log.resource_id && !target && (
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {log.resource_id}
                          </div>
                        )}
                        {log.details?.redirect && (
                          <div className="text-xs text-gray-500 mt-1">{log.details.redirect}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {log.details && (
                          <details className="cursor-pointer">
                            <summary className="text-biker-yellow hover:underline">
                              Bekijk details
                            </summary>
                            <pre className="mt-2 text-xs bg-biker-black p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {log.ip_address || '-'}
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/admin/audit?page=${page - 1}${params.action ? `&action=${params.action}` : ''}${params.resource ? `&resource=${params.resource}` : ''}`}
                className="px-4 py-2 bg-biker-gray text-white rounded-lg hover:bg-biker-yellow hover:text-biker-black transition-colors font-bold"
              >
                ← Vorige
              </Link>
            )}
            
            <div className="px-4 py-2 bg-biker-dark text-white rounded-lg border-2 border-biker-gray">
              Pagina {page} van {totalPages}
            </div>

            {page < totalPages && (
              <Link
                href={`/admin/audit?page=${page + 1}${params.action ? `&action=${params.action}` : ''}${params.resource ? `&resource=${params.resource}` : ''}`}
                className="px-4 py-2 bg-biker-gray text-white rounded-lg hover:bg-biker-yellow hover:text-biker-black transition-colors font-bold"
              >
                Volgende →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

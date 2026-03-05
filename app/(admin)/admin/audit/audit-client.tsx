'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface AuditFiltersProps {
  actions: string[];
  resourceTypes: string[];
}

export function AuditFilters({ actions, resourceTypes }: AuditFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentAction = searchParams.get('action') || '';
  const currentResource = searchParams.get('resource') || '';

  const handleActionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('action', value);
    } else {
      params.delete('action');
    }
    params.delete('page');
    router.push(`/admin/audit?${params.toString()}`);
  };

  const handleResourceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('resource', value);
    } else {
      params.delete('resource');
    }
    params.delete('page');
    router.push(`/admin/audit?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/admin/audit');
  };

  return (
    <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Action Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Actie
          </label>
          <select
            className="bg-biker-black text-white border-2 border-biker-gray rounded-lg px-4 py-2 focus:border-biker-yellow outline-none"
            value={currentAction}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Alle acties</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Resource Type
          </label>
          <select
            className="bg-biker-black text-white border-2 border-biker-gray rounded-lg px-4 py-2 focus:border-biker-yellow outline-none"
            value={currentResource}
            onChange={(e) => handleResourceChange(e.target.value)}
          >
            <option value="">Alle resources</option>
            {resourceTypes.map(resource => (
              <option key={resource} value={resource}>{resource}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(currentAction || currentResource) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-biker-gray text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Wis filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

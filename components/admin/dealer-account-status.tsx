'use client';

import { setDealerAccountStatus } from '@/app/actions/admin-dealers';
import type { DealerAccountStatus } from '@/lib/dealer/status';

export function DealerAccountStatusButtons({
  dealerId,
  status,
}: {
  dealerId: string;
  status: DealerAccountStatus;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(['pending', 'active', 'rejected'] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setDealerAccountStatus(dealerId, value)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
            status === value ? 'bg-biker-yellow text-black' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {value === 'pending' ? 'In behandeling' : value === 'active' ? 'Actief' : 'Afgewezen'}
        </button>
      ))}
    </div>
  );
}

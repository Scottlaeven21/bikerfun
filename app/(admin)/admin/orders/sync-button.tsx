'use client';

import { useState } from 'react';

export function SyncOrdersButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/sync-all-orders', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `✅ ${data.synced || 0} order(s) succesvol gesynchroniseerd naar WooCommerce!`,
        });
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          success: false,
          message: `❌ Fout: ${data.error || 'Er ging iets mis'}`,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: '❌ Kan niet verbinden met de server',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          syncing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-biker-yellow hover:bg-biker-yellowHover text-black shadow-lg hover:shadow-xl'
        }`}
      >
        {syncing ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Synchroniseren...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Sync Orders naar WooCommerce
          </>
        )}
      </button>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={result.success ? 'text-green-700' : 'text-red-700'}>{result.message}</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface SyncResult {
  success: boolean;
  occasions?: {
    imported: number;
    updated: number;
    deleted: number;
    failed: number;
  };
  products?: {
    imported: number;
    updated: number;
    deleted: number;
    failed: number;
  };
  orders?: {
    synced: number;
    failed: number;
  };
  errors?: string[];
}

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);
    setProgress('');

    try {
      setProgress('Verbinden met WooCommerce...');
      
      const response = await fetch('/api/admin/sync-woocommerce', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const data = await response.json();
      setResult(data);
      setProgress('');
    } catch (error: any) {
      setResult({
        success: false,
        errors: [error.message || 'Er ging iets mis tijdens het syncen'],
      });
      setProgress('');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WooCommerce Synchronisatie
          </h1>
          <p className="text-gray-600">
            Synchroniseer occasions, producten en bestellingen tussen WooCommerce en de website.
          </p>
        </div>

        {/* Sync Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Occasions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏍️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Occasions</h3>
                <p className="text-sm text-gray-600">WooCommerce → Website</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Importeert en update occasions vanuit WooCommerce (producten &gt; €5000)
            </p>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛍️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Producten</h3>
                <p className="text-sm text-gray-600">WooCommerce → Website</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Importeert en update webshop producten vanuit WooCommerce
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bestellingen</h3>
                <p className="text-sm text-gray-600">Website → WooCommerce</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Synchroniseert nieuwe bestellingen naar WooCommerce
            </p>
          </div>
        </div>

        {/* Sync Button */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Synchroniseer Nu</h2>
              <p className="text-blue-100 mb-4">
                Voert een volledige synchronisatie uit van alle data
              </p>
              {progress && (
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{progress}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              {syncing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Bezig met syncen...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Start Synchronisatie
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Success/Error Summary */}
            <div
              className={`rounded-lg p-6 ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {result.success ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">
                      Synchronisatie Voltooid
                    </h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-900">
                      Synchronisatie Mislukt
                    </h3>
                  </>
                )}
              </div>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-red-900 mb-2">Fouten:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.errors.map((error, i) => (
                      <li key={i} className="text-sm text-red-800">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Occasions Results */}
            {result.occasions && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏍️</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Occasions Sync
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {result.occasions.imported}
                    </div>
                    <div className="text-sm text-gray-600">Geïmporteerd</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {result.occasions.updated}
                    </div>
                    <div className="text-sm text-gray-600">Geüpdatet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {result.occasions.deleted}
                    </div>
                    <div className="text-sm text-gray-600">Verwijderd</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {result.occasions.failed}
                    </div>
                    <div className="text-sm text-gray-600">Mislukt</div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Results */}
            {result.products && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🛍️</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Producten Sync
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {result.products.imported}
                    </div>
                    <div className="text-sm text-gray-600">Geïmporteerd</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {result.products.updated}
                    </div>
                    <div className="text-sm text-gray-600">Geüpdatet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {result.products.deleted}
                    </div>
                    <div className="text-sm text-gray-600">Verwijderd</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {result.products.failed}
                    </div>
                    <div className="text-sm text-gray-600">Mislukt</div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Results */}
            {result.orders && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📦</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bestellingen Sync
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {result.orders.synced}
                    </div>
                    <div className="text-sm text-gray-600">Gesynct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {result.orders.failed}
                    </div>
                    <div className="text-sm text-gray-600">Mislukt</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Automatische Synchronisatie
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                De synchronisatie draait automatisch elke nacht om 03:00 uur.
              </p>
              <p className="text-sm text-blue-800">
                Gebruik deze pagina alleen als je direct wilt synchroniseren na het toevoegen
                van nieuwe producten of occasions in WooCommerce.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

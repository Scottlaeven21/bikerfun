import { Metadata } from 'next';
import { SyncButton } from '@/components/admin/sync-button';

export const metadata: Metadata = {
  title: 'WooCommerce Sync - Admin',
  description: 'Synchroniseer data tussen WooCommerce en Supabase',
};

export default function SyncPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Inter'] mb-2">WooCommerce Synchronisatie</h1>
        <p className="text-gray-600">
          Synchroniseer occasions, producten en bestellingen tussen WooCommerce en Supabase
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Occasions Info */}
        <div className="bg-gradient-to-br from-biker-yellow/10 to-white rounded-xl shadow-lg p-6 border-2 border-biker-yellow/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-biker-yellow/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Occasions</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Importeert motoren uit WooCommerce categorie "Motoren" naar de occasions tabel.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>WooCommerce → Supabase</span>
          </div>
        </div>

        {/* Products Info */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Producten</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Synchroniseert alle webshop producten (helmcovers, sleutelhangers, etc.) naar Supabase.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>WooCommerce → Supabase</span>
          </div>
        </div>

        {/* Orders Info */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Bestellingen</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Stuurt betaalde bestellingen naar WooCommerce voor email automatisering.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Supabase → WooCommerce</span>
          </div>
        </div>
      </div>

      {/* Sync Control */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Handmatige Synchronisatie
          </h2>
          <p className="text-sm text-gray-600">
            Klik op de knop hieronder om een handmatige synchronisatie te starten. 
            Dit proces kan 30-60 seconden duren.
          </p>
        </div>

        <SyncButton />
      </div>

      {/* Automatic Sync Info */}
      <div className="mt-8 bg-blue-50 rounded-xl shadow p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Automatische Synchronisatie</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              De synchronisatie draait automatisch <strong>elke nacht om 03:00 uur</strong> via een Vercel cron job. 
              Handmatige synchronisatie is alleen nodig als je direct updates wilt zien.
            </p>
          </div>
        </div>
      </div>

      {/* Known Issues */}
      <div className="mt-6 bg-orange-50 rounded-xl shadow p-6 border border-orange-200">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Bekende Problemen</h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Occasions Sync:</strong> WordPress memory limit (128MB) is te laag. 
                  IT moet dit verhogen naar 512MB in wp-config.php. 
                  Zie <code className="bg-orange-100 px-2 py-0.5 rounded text-xs">URGENT_VOOR_ITER_2_MAART.md</code> voor details.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  <strong>Sync Duur:</strong> De synchronisatie kan 30-60 seconden duren afhankelijk van het aantal producten.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

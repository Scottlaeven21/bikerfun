'use client';

import { useState, useEffect } from 'react';

interface SyncResult {
  success: boolean;
  occasions?: {
    imported: number;
    updated: number;
    failed: number;
  };
  products?: {
    imported: number;
    updated: number;
    failed: number;
  };
  orders?: {
    synced: number;
    failed: number;
  };
  errors?: string[];
}

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Progress bar animation
  useEffect(() => {
    if (!syncing) {
      setProgress(0);
      return;
    }

    // Simulate progress over ~3 minutes
    const duration = 180000; // 3 minutes in ms
    const interval = 500; // Update every 500ms
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        // Slow down near the end (90-95%)
        if (prev >= 90) return Math.min(prev + (increment * 0.2), 95);
        // Speed up in middle (30-70%)
        if (prev >= 30 && prev < 70) return prev + (increment * 1.5);
        // Normal speed
        return Math.min(prev + increment, 95);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [syncing]);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      const response = await fetch('/api/admin/sync-woocommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setProgress(100); // Complete!
      setResult(data);

      if (!data.success && data.errors) {
        setError(data.errors.join(', '));
      }
    } catch (err: any) {
      setError(err.message || 'Onbekende fout tijdens synchronisatie');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Button */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center space-x-3 px-6 py-3 bg-biker-yellow text-black text-base font-bold rounded-lg hover:bg-yellow-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-biker-yellow"
          >
            <svg 
              className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span>{syncing ? 'Synchroniseren...' : 'Start Synchronisatie'}</span>
          </button>

          {syncing && (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-biker-yellow rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Bezig met synchroniseren...</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {syncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Voortgang</span>
              <span className="text-biker-yellow font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-biker-yellow to-yellow-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              {progress < 30 && 'Ophalen van occasions uit WooCommerce...'}
              {progress >= 30 && progress < 60 && 'Ophalen van producten uit WooCommerce...'}
              {progress >= 60 && progress < 90 && 'Synchroniseren naar database...'}
              {progress >= 90 && 'Bijna klaar...'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">Synchronisatie Fouten</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`border-l-4 p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 border-green-500' 
              : 'bg-yellow-50 border-yellow-500'
          }`}>
            <div className="flex items-center space-x-3">
              <svg className={`w-6 h-6 ${result.success ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={result.success ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
              </svg>
              <div>
                <h3 className={`text-sm font-bold ${result.success ? 'text-green-800' : 'text-yellow-800'}`}>
                  {result.success ? 'Synchronisatie Voltooid!' : 'Synchronisatie Voltooid met Waarschuwingen'}
                </h3>
                <p className={`text-xs ${result.success ? 'text-green-700' : 'text-yellow-700'} mt-1`}>
                  {result.success 
                    ? 'Alle data is succesvol gesynchroniseerd.' 
                    : 'Sommige onderdelen konden niet worden gesynchroniseerd.'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Occasions */}
            {result.occasions && (
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-biker-yellow/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Occasions</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Geïmporteerd:</span>
                    <span className="font-semibold text-green-600">{result.occasions.imported}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bijgewerkt:</span>
                    <span className="font-semibold text-blue-600">{result.occasions.updated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gefaald:</span>
                    <span className={`font-semibold ${result.occasions.failed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {result.occasions.failed}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {result.products && (
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Producten</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Geïmporteerd:</span>
                    <span className="font-semibold text-green-600">{result.products.imported}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bijgewerkt:</span>
                    <span className="font-semibold text-blue-600">{result.products.updated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gefaald:</span>
                    <span className={`font-semibold ${result.products.failed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {result.products.failed}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {result.orders && (
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Bestellingen</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gesynchroniseerd:</span>
                    <span className="font-semibold text-green-600">{result.orders.synced}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gefaald:</span>
                    <span className={`font-semibold ${result.orders.failed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {result.orders.failed}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Errors List */}
          {result.errors && result.errors.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Waarschuwingen
              </h4>
              <ul className="space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-sm text-orange-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

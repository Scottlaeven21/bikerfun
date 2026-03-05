'use client';

import { useState } from 'react';
import { clearManualOverrides, removeManualOverride } from '@/lib/utils/manual-overrides';

interface ManualOverridesBadgeProps {
  tableName: 'occasions' | 'webshop_products';
  recordId: string;
  manualOverrides: string[];
  onUpdate?: () => void;
}

export function ManualOverridesBadge({
  tableName,
  recordId,
  manualOverrides,
  onUpdate,
}: ManualOverridesBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!manualOverrides || manualOverrides.length === 0) {
    return null;
  }

  const handleRemoveOverride = async (fieldName: string) => {
    setLoading(true);
    try {
      await removeManualOverride(tableName, recordId, fieldName);
      onUpdate?.();
    } catch (error) {
      console.error('Error removing override:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de override');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Weet je zeker dat je alle manual overrides wilt verwijderen? De volgende sync zal deze velden overschrijven met WooCommerce data.')) {
      return;
    }
    
    setLoading(true);
    try {
      await clearManualOverrides(tableName, recordId);
      onUpdate?.();
    } catch (error) {
      console.error('Error clearing overrides:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de overrides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="font-bold text-amber-900 text-sm">
              {manualOverrides.length} veld{manualOverrides.length !== 1 ? 'en' : ''} handmatig aangepast
            </p>
            <p className="text-xs text-amber-700">
              Deze velden worden niet overschreven door WooCommerce sync
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-700 hover:text-amber-900 text-sm font-semibold"
        >
          {isExpanded ? 'Verberg' : 'Toon details'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {manualOverrides.map((field) => (
              <div
                key={field}
                className="inline-flex items-center gap-2 bg-white border border-amber-300 rounded-lg px-3 py-1.5"
              >
                <code className="text-sm font-mono text-amber-900">{field}</code>
                <button
                  onClick={() => handleRemoveOverride(field)}
                  disabled={loading}
                  className="text-amber-600 hover:text-red-600 disabled:opacity-50"
                  title="Reset naar WooCommerce waarde"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-amber-200">
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
            >
              Reset alle velden naar WooCommerce
            </button>
            <span className="text-xs text-amber-600">
              (velden worden overschreven bij volgende sync)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

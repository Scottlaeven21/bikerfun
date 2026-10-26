'use client';

import { useEffect, useState } from 'react';
import { getAnalyticsData } from '@/app/actions/analytics';
import Image from 'next/image';
import { formatDuration, friendlyPageName } from '@/lib/analytics/sources';

interface AnalyticsData {
  views: {
    today: number;
    yesterday: number;
    week: number;
    month: number;
    total: number;
    change: number;
  };
  conversions: {
    contactForms: number;
    motorAanvragen: number;
    omkeuren?: number;
    total: number;
  };
  topReferrers?: Array<{ source: string; count: number }>;
  topClicks?: Array<{ label: string; count: number }>;
  pageDurations?: Array<{ path: string; avgSeconds: number; views: number }>;
  topOccasions: Array<{
    occasion_id: string;
    view_count: number;
    brand?: string;
    model?: string;
    main_image?: string;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getAnalyticsData();
      if (result.success && result.data) {
        setData(result.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray animate-pulse">
            <div className="h-4 bg-biker-gray/30 rounded w-24 mb-4"></div>
            <div className="h-10 bg-biker-gray/30 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const changeIcon = data.views.change >= 0 ? '↑' : '↓';
  const changeColor = data.views.change >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Views */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-biker-light text-sm font-bold uppercase tracking-wider">Vandaag</span>
            <div className="relative group">
              <svg className="w-6 h-6 text-biker-yellow cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <div className="absolute right-0 top-8 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl border border-biker-yellow">
                Aantal pagina weergaven vandaag
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{data.views.today}</div>
          <div className={`text-sm ${changeColor} font-medium`}>
            {changeIcon} {Math.abs(data.views.change).toFixed(1)}% vs gisteren
          </div>
        </div>

        {/* Week Views */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-biker-light text-sm font-bold uppercase tracking-wider">Deze Week</span>
            <div className="relative group">
              <svg className="w-6 h-6 text-biker-yellow cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute right-0 top-8 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl border border-biker-yellow">
                Totaal pagina weergaven in de laatste 7 dagen
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{data.views.week}</div>
          <div className="text-sm text-biker-light">
            {(data.views.week / 7).toFixed(0)} per dag gemiddeld
          </div>
        </div>

        {/* Month Views */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-biker-light text-sm font-bold uppercase tracking-wider">Deze Maand</span>
            <div className="relative group">
              <svg className="w-6 h-6 text-biker-yellow cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="absolute right-0 top-8 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl border border-biker-yellow">
                Totaal pagina weergaven in de laatste 30 dagen
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{data.views.month}</div>
          <div className="text-sm text-biker-light">
            {(data.views.month / 30).toFixed(0)} per dag gemiddeld
          </div>
        </div>

        {/* Total Conversions */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-biker-light text-sm font-bold uppercase tracking-wider">Conversies</span>
            <div className="relative group">
              <svg className="w-6 h-6 text-green-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute right-0 top-8 w-52 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl border border-green-500">
                Totaal aantal contactformulier inzendingen en motor op aanvraag formulieren van de laatste 30 dagen
              </div>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{data.conversions.total}</div>
          <div className="text-sm text-biker-light">
            {data.conversions.contactForms} contact · {data.conversions.motorAanvragen} aanvragen
            {data.conversions.omkeuren ? ` · ${data.conversions.omkeuren} omkeuren` : ''}
          </div>
        </div>
      </div>

      {/* Device Breakdown & Top Occasions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center flex-shrink-0">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Apparaten
          </h3>
          <div className="space-y-4">
            {/* Mobile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-biker-light text-sm">Mobiel</span>
                <span className="text-white font-bold">{data.devices.mobile}</span>
              </div>
              <div className="w-full bg-biker-gray/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-biker-yellow h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(data.devices.mobile / (data.devices.mobile + data.devices.desktop + data.devices.tablet || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Desktop */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-biker-light text-sm">Desktop</span>
                <span className="text-white font-bold">{data.devices.desktop}</span>
              </div>
              <div className="w-full bg-biker-gray/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(data.devices.desktop / (data.devices.mobile + data.devices.desktop + data.devices.tablet || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Tablet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-biker-light text-sm">Tablet</span>
                <span className="text-white font-bold">{data.devices.tablet}</span>
              </div>
              <div className="w-full bg-biker-gray/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(data.devices.tablet / (data.devices.mobile + data.devices.desktop + data.devices.tablet || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Occasions */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center flex-shrink-0">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Populairste Occasions
          </h3>
          <div className="space-y-3 overflow-y-auto pr-2 max-h-[252px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#F7D917 rgba(55, 55, 55, 0.3)' }}>
            {data.topOccasions.length > 0 ? (
              data.topOccasions.map((occasion, index) => (
                <div key={occasion.occasion_id} className="flex items-center space-x-3 p-3 bg-biker-black/50 rounded-lg hover:bg-biker-black/70 transition-all">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-biker-yellow flex items-center justify-center font-bold text-black text-sm">
                    {index + 1}
                  </div>
                  {occasion.main_image && (
                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image 
                        src={occasion.main_image} 
                        alt={`${occasion.brand} ${occasion.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {occasion.brand} {occasion.model}
                    </p>
                    <p className="text-biker-light text-xs">
                      {occasion.view_count} views
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-biker-muted text-center py-4">
                Nog geen data beschikbaar
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
            Bezoekers komen vanaf
          </h3>
          <div className="space-y-3">
            {(data.topReferrers || []).length > 0 ? (
              data.topReferrers!.map((item) => {
                const total = data.topReferrers!.reduce((sum, row) => sum + row.count, 0) || 1;
                const pct = (item.count / total) * 100;
                return (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{item.source}</span>
                      <span className="text-biker-light">{item.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-biker-gray/30 rounded-full h-2 overflow-hidden">
                      <div className="bg-biker-yellow h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-biker-muted text-sm">Nog geen bronnen gemeten</p>
            )}
          </div>
        </div>

        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
            Meest geklikte knoppen
          </h3>
          <div className="space-y-3">
            {(data.topClicks || []).length > 0 ? (
              data.topClicks!.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3">
                  <span className="text-white text-sm truncate">{item.label}</span>
                  <span className="text-biker-yellow font-bold text-sm shrink-0">{item.count}×</span>
                </div>
              ))
            ) : (
              <p className="text-biker-muted text-sm">
                Kliks worden nu bijgehouden. Hier verschijnen de populairste knoppen.
              </p>
            )}
          </div>
        </div>

        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
            Tijd per pagina
          </h3>
          <div className="space-y-3">
            {(data.pageDurations || []).length > 0 ? (
              data.pageDurations!.map((item) => (
                <div key={item.path} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{friendlyPageName(item.path)}</p>
                    <p className="text-biker-muted text-xs">{item.path}</p>
                  </div>
                  <span className="text-biker-yellow font-bold text-sm shrink-0">
                    {formatDuration(item.avgSeconds)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-biker-muted text-sm">
                Bezoektijd wordt nu bijgehouden. Gemiddelden verschijnen hier na de eerste bezoeken.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

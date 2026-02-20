'use client';

import { useEffect, useState } from 'react';
import { getAnalyticsData } from '@/app/actions/analytics';
import Image from 'next/image';

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
    total: number;
  };
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
            <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
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
            <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
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
            <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
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
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{data.conversions.total}</div>
          <div className="text-sm text-biker-light">
            {data.conversions.contactForms} contact · {data.conversions.motorAanvragen} aanvragen
          </div>
        </div>
      </div>

      {/* Device Breakdown & Top Occasions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
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
        <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Populairste Occasions
          </h3>
          <div className="space-y-3">
            {data.topOccasions.length > 0 ? (
              data.topOccasions.map((occasion, index) => (
                <div key={occasion.occasion_id} className="flex items-center space-x-3 p-3 bg-biker-black/50 rounded-lg hover:bg-biker-black/70 transition-all">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-biker-yellow flex items-center justify-center font-bold text-black text-sm">
                    {index + 1}
                  </div>
                  {occasion.main_image && (
                    <div className="relative w-12 h-12 rounded overflow-hidden">
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
    </div>
  );
}

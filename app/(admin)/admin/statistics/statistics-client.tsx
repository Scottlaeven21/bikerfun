'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DetailedAnalytics } from '@/lib/analytics/queries';

interface StatisticsClientProps {
  initialData: DetailedAnalytics;
  initialStartDate: string;
  initialEndDate: string;
}

const COLORS = ['#F7D917', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function StatisticsClient({
  initialData,
  initialStartDate,
  initialEndDate,
}: StatisticsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(initialStartDate.split('T')[0]);
  const [endDate, setEndDate] = useState(initialEndDate.split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const data = initialData;

  const handleDateChange = () => {
    startTransition(() => {
      router.push(`/admin/statistics?startDate=${startDate}&endDate=${endDate}`);
    });
  };

  const setPresetRange = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setEndDate(format(end, 'yyyy-MM-dd'));
    setStartDate(format(start, 'yyyy-MM-dd'));
    startTransition(() => {
      router.push(`/admin/statistics?days=${days}`);
    });
  };

  const setThisWeek = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
    startTransition(() => {
      router.push(`/admin/statistics?startDate=${format(start, 'yyyy-MM-dd')}&endDate=${format(end, 'yyyy-MM-dd')}`);
    });
  };

  // Format data for charts
  const chartData = data.dailyStats.map(stat => ({
    date: format(new Date(stat.date), 'dd MMM', { locale: nl }),
    'Totaal Views': stat.total_views,
    'Unieke Bezoekers': stat.unique_visitors,
  })).reverse();

  const deviceData = [
    { name: 'Mobiel', value: data.deviceBreakdown.mobile },
    { name: 'Desktop', value: data.deviceBreakdown.desktop },
    { name: 'Tablet', value: data.deviceBreakdown.tablet },
  ];

  const eventData = data.topEvents.map(event => ({
    name: event.event_name.replace('_', ' '),
    value: event.count,
  }));

  return (
    <div className="space-y-8">
      {/* Date Range Picker */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Quick Presets */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPresetRange(7)}
              disabled={isPending}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-biker-yellow hover:text-biker-black hover:border-biker-yellow transition-all font-bold shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Laatste 7 dagen
            </button>
            <button
              onClick={() => setPresetRange(30)}
              disabled={isPending}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-biker-yellow hover:text-biker-black hover:border-biker-yellow transition-all font-bold shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Laatste 30 dagen
            </button>
            <button
              onClick={() => setPresetRange(90)}
              disabled={isPending}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-biker-yellow hover:text-biker-black hover:border-biker-yellow transition-all font-bold shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Laatste 90 dagen
            </button>
            <button
              onClick={setThisWeek}
              disabled={isPending}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-biker-yellow hover:text-biker-black hover:border-biker-yellow transition-all font-bold shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Deze Week
            </button>
          </div>

          {/* Custom Date Range */}
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Van
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow/20 outline-none shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tot
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow/20 outline-none shadow-sm"
              />
            </div>
            <button
              onClick={handleDateChange}
              disabled={isPending}
              className="px-6 py-2 bg-biker-yellow text-biker-black rounded-lg hover:bg-yellow-400 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isPending ? 'Laden...' : 'Toepassen'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-biker-yellow/10 to-white rounded-xl shadow-lg p-6 border-2 border-biker-yellow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Totaal Views</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalStats.total_views.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-biker-yellow to-yellow-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Unieke Bezoekers</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalStats.unique_visitors.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Totaal Events</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalStats.total_events.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Conversie Rate</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalStats.conversion_rate.toFixed(2)}%</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Views Over Time Chart */}
      <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
          <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Views Over Tijd
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '2px solid #F7D917',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Totaal Views" 
              stroke="#F7D917" 
              strokeWidth={3}
              dot={{ fill: '#F7D917', r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="Unieke Bezoekers" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Apparaten
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '2px solid #F7D917',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Events */}
        <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
            <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Top Events
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#9CA3AF" 
                width={150}
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '2px solid #F7D917',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#F7D917" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
          <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Populairste Pagina's
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-biker-black border-b-2 border-biker-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Pagina
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Unieke Bezoekers
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Views/Bezoeker
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topPages.map((page, index) => (
                <tr key={page.page_path} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {page.page_path || '/'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-right font-bold">
                    {page.unique_visitors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                    {(page.views / page.unique_visitors).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referrer Stats */}
      <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
          <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Traffic Bronnen
        </h2>
        <div className="space-y-3">
          {data.referrerStats.map((referrer, index) => {
            const total = data.referrerStats.reduce((sum, r) => sum + r.count, 0);
            const percentage = (referrer.count / total) * 100;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">
                    {referrer.referrer === 'Direct' ? '🔗 Direct' : `🌐 ${referrer.referrer.replace(/^https?:\/\//, '').split('/')[0]}`}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {referrer.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-biker-gray/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-biker-yellow h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-biker-dark rounded-lg border-2 border-biker-gray p-6">
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight flex items-center">
          <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Dagelijkse Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-biker-black border-b-2 border-biker-gray">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Totaal Views
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Unieke Bezoekers
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Views per Bezoeker
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-biker-gray">
              {data.dailyStats.map((stat) => (
                <tr key={stat.date} className="hover:bg-biker-black transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {format(new Date(stat.date), 'EEEE dd MMMM yyyy', { locale: nl })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right font-bold">
                    {stat.total_views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-biker-yellow text-right font-bold">
                    {stat.unique_visitors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    {stat.unique_visitors > 0 ? (stat.total_views / stat.unique_visitors).toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

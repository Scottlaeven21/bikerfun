import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Occasions Beheer | Admin',
  description: 'Beheer occasions in het admin dashboard',
};

export default async function AdminOccasionsPage() {
  const supabase = await createClient();

  const { data: occasions } = await supabase
    .from('occasions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const occasionsList = occasions as Occasion[] | null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-['Inter']">Occasions Beheer</h1>
          <p className="text-gray-600">Beheer alle occasions op de website</p>
        </div>
        <Link
          href="/admin/occasions/new"
          className="flex items-center space-x-2 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nieuwe Occasion</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Beschikbaar</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'available').length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Gereserveerd</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'reserved').length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg p-6 border border-red-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Verkocht</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'sold').length || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-biker-yellow/10 to-white rounded-xl shadow-lg p-6 border-2 border-biker-yellow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Totaal</p>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-biker-yellow to-yellow-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {occasionsList?.length || 0}
          </p>
        </div>
      </div>

      {/* Occasions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {occasionsList && occasionsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Motor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jaar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Prijs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Km-stand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {occasionsList.map((occasion) => (
                  <tr key={occasion.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {occasion.main_image ? (
                            <Image
                              src={occasion.main_image}
                              alt={`${occasion.brand} ${occasion.model}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-biker-yellow/10">
                              <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {occasion.brand} {occasion.model}
                          </p>
                          <p className="text-sm text-gray-600">{occasion.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {occasion.year}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-biker-yellow">
                        {formatPrice(occasion.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {occasion.mileage.toLocaleString('nl-NL')} km
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      occasion.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : occasion.status === 'reserved'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {occasion.status === 'available' ? 'Beschikbaar' : occasion.status === 'reserved' ? 'Gereserveerd' : 'Verkocht'}
                      </span>
                      {!occasion.is_active && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-600">
                          Verborgen
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/occasions/${occasion.id}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                          title="Bekijk op website"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/occasions/${occasion.id}/edit`}
                          className="p-2 text-biker-yellow hover:bg-biker-yellow/10 rounded-lg transition-all group"
                          title="Bewerken"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-biker-yellow/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 font-medium">Nog geen occasions toegevoegd</p>
            <Link
              href="/admin/occasions/new"
              className="inline-flex items-center space-x-2 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Voeg eerste occasion toe</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

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
    .order('created_at', { ascending: false });

  const occasionsList = occasions as Occasion[] | null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Occasions Beheer</h1>
          <p className="text-gray-600">Beheer alle occasions op de website</p>
        </div>
        <Link
          href="/admin/occasions/new"
          className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
        >
          + Nieuwe Occasion
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Beschikbaar</p>
          <p className="text-2xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'available').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Gereserveerd</p>
          <p className="text-2xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'reserved').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Verkocht</p>
          <p className="text-2xl font-bold text-gray-900">
            {occasionsList?.filter(o => o.status === 'sold').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-biker-yellow">
          <p className="text-sm text-gray-600">Totaal</p>
          <p className="text-2xl font-bold text-gray-900">
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
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🏍️
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
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {occasion.status === 'available' ? 'Beschikbaar' : 
                         occasion.status === 'reserved' ? 'Gereserveerd' : 'Verkocht'}
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
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          title="Bekijk op website"
                        >
                          👁️
                        </Link>
                        <Link
                          href={`/admin/occasions/${occasion.id}/edit`}
                          className="text-biker-yellow hover:text-biker-yellowHover font-semibold text-sm"
                          title="Bewerken"
                        >
                          ✏️
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
            <div className="text-6xl mb-4">🏍️</div>
            <p className="text-gray-600 mb-6">Nog geen occasions toegevoegd</p>
            <Link
              href="/admin/occasions/new"
              className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300"
            >
              Voeg eerste occasion toe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

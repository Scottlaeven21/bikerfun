import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categorieën Beheer',
  description: 'Beheer categorieën',
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const categories = data as Category[] | null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categorieën</h1>
        <Link
          href="/admin/categories/new"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nieuwe Categorie
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Er is een fout opgetreden bij het laden van categorieën.
        </div>
      )}

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{category.slug}</p>
              {category.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {/* TODO: Fix products count */}
                  Producten: 0
                </span>
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Bewerken
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">Nog geen categorieën toegevoegd.</p>
          <Link
            href="/admin/categories/new"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Voeg je eerste categorie toe
          </Link>
        </div>
      )}
    </div>
  );
}

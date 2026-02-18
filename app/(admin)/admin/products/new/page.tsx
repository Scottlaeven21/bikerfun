import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types';
import { ProductForm } from '@/components/admin/product-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nieuw Product | Admin',
  description: 'Voeg een nieuw product toe',
};

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  const categoriesData = (categories as Category[]) || [];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-red-600 hover:text-red-800 font-semibold mb-4 inline-block"
          >
            ← Terug naar producten
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nieuw product</h1>
          <p className="text-gray-600">Vul de gegevens in voor het nieuwe product</p>
        </div>
        <ProductForm categories={categoriesData} isEdit={false} />
      </div>
    </div>
  );
}

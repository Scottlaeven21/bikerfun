import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SupabaseProduct } from '@/lib/supabase/products';
import { ProductsTable } from '@/components/admin/products-table';

export const metadata: Metadata = {
  title: 'Producten Beheer',
  description: 'Beheer producten',
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });

  // Filter out occasions/motors (consistent with frontend)
  const allProducts = data as SupabaseProduct[] | null;
  const products = allProducts?.filter(product => {
    const isOccasion = product.price > 1000;
    const hasMotorCategory = product.categories?.some((cat: string) => 
      ['Motoren', 'Motors', 'Occasions', 'Bikes'].includes(cat)
    );
    return !isOccasion && !hasMotorCategory;
  }) || null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webshop Producten</h1>
          <p className="text-gray-600 mt-2">
            {products?.length || 0} producten geïmporteerd uit WooCommerce
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Er is een fout opgetreden bij het laden van producten.
        </div>
      )}

      {products && products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">Geen producten gevonden.</p>
          <p className="text-sm text-gray-500">
            Producten worden automatisch geïmporteerd uit WooCommerce via het CSV import script.
          </p>
        </div>
      )}
    </div>
  );
}

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Product, Category } from '@/types';
import { ProductForm } from '@/components/admin/product-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product Bewerken | Admin',
  description: 'Bewerk een product',
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: product },
    { data: categories },
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  const productData = product as Product | null;
  const categoriesData = (categories as Category[]) || [];

  if (!productData) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product bewerken</h1>
          <p className="text-gray-600">{productData.name}</p>
        </div>
        <ProductForm product={productData} categories={categoriesData} isEdit={true} />
      </div>
    </div>
  );
}

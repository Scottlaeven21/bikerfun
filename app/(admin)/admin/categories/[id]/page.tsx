import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types';
import { CategoryForm } from '@/components/admin/category-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categorie Bewerken | Admin',
  description: 'Bewerk een categorie',
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  const categoryData = category as Category | null;

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="text-red-600 hover:text-red-800 font-semibold mb-4 inline-block"
          >
            ← Terug naar categorieën
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorie bewerken</h1>
          <p className="text-gray-600">{categoryData.name}</p>
        </div>
        <CategoryForm category={categoryData} isEdit={true} />
      </div>
    </div>
  );
}

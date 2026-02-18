import { Metadata } from 'next';
import { CategoryForm } from '@/components/admin/category-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nieuwe Categorie | Admin',
  description: 'Voeg een nieuwe categorie toe',
};

export default function NewCategoryPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nieuwe categorie</h1>
          <p className="text-gray-600">Vul de gegevens in voor de nieuwe categorie</p>
        </div>
        <CategoryForm isEdit={false} />
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';

interface CategoryFilterMobileProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  currentCategory?: string;
}

export function CategoryFilterMobile({ categories, currentCategory }: CategoryFilterMobileProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      router.push(`/products?category=${value}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <select
      value={currentCategory || ''}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-biker-black font-bold uppercase text-sm tracking-wider focus:border-biker-yellow focus:outline-none shadow-sm"
    >
      <option value="">Alle Categorieën</option>
      {categories.map((category) => (
        <option key={category.id} value={category.slug}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

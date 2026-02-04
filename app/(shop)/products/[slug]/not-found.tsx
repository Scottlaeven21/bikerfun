import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Product niet gevonden
        </h2>
        <p className="text-gray-600 mb-8">
          Het product dat je zoekt bestaat niet of is niet meer beschikbaar.
        </p>
        <Link
          href="/products"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Bekijk Alle Producten
        </Link>
      </div>
    </div>
  );
}

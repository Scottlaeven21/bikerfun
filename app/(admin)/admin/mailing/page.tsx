import { AdminMailingForm } from '@/components/admin/mailing-form';

export const metadata = { title: 'Mailing | Admin' };
export const dynamic = 'force-dynamic';

export default function AdminMailingPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mailing</h1>
      <p className="text-gray-600 mb-8">
        Stuur een mail in Bikerfun-stijl. Header, kleuren en footer gaan er automatisch bij.
      </p>
      <div className="bg-white rounded-lg shadow-md p-6">
        <AdminMailingForm />
      </div>
    </div>
  );
}

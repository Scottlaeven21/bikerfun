import { DealerApplicationForm } from '@/components/dealer/application-form';

export const metadata = { title: 'Nieuwe omkeuring - Dealerportaal', robots: { index: false, follow: false } };

export default function NewDealerApplicationPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Motor aanmelden</h1>
      <p className="text-gray-600 mb-8">
        Vul kenteken, meldcode en framenummer in. Daarna kun je het formulier downloaden en weer uploaden.
      </p>
      <DealerApplicationForm />
    </div>
  );
}

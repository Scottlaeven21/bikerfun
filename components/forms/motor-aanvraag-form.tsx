'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { sendMotorAanvraagEmail } from '@/app/actions/email';

interface MotorAanvraagFormProps {
  motorDetails?: {
    brand?: string;
    model?: string;
    price?: number;
    occasionUrl?: string;
  };
}

export function MotorAanvraagForm({ motorDetails }: MotorAanvraagFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    try {
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const message = formData.get('message');

      // Validation
      if (!name || !email || !message) {
        setMessage({ type: 'error', text: 'Vul alle verplichte velden in.' });
        return;
      }

      const data = {
        name: name as string,
        email: email as string,
        phone: phone ? (phone as string) : undefined,
        message: message as string,
        motorDetails: motorDetails || undefined,
      };

      startTransition(async () => {
        const result = await sendMotorAanvraagEmail(data);

        if (result.success) {
          setMessage({ type: 'success', text: result.message || 'Aanvraag verzonden!' });
          // Reset form
          (document.getElementById('motor-aanvraag-form') as HTMLFormElement)?.reset();
        } else {
          setMessage({ type: 'error', text: result.error || 'Er ging iets mis.' });
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ type: 'error', text: 'Er is een onverwachte fout opgetreden.' });
    }
  }

  return (
    <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
      <h2 
        style={{ fontFamily: 'var(--font-inter)' }}
        className="text-3xl font-bold mb-6 uppercase tracking-tight"
      >
        {motorDetails ? 'Aanvraag versturen' : 'Motor op Aanvraag'}
      </h2>

      {motorDetails && (
        <div className="mb-6 p-4 bg-biker-black border-2 border-biker-yellow rounded-lg">
          <p className="text-biker-yellow text-sm font-bold mb-2 uppercase tracking-wider">
            Je vraagt informatie aan over:
          </p>
          <p className="text-white font-bold text-lg">
            {motorDetails.brand} {motorDetails.model}
          </p>
          {motorDetails.price && (
            <p className="text-biker-yellow text-sm mt-1">
              € {motorDetails.price.toLocaleString('nl-NL')},-
            </p>
          )}
        </div>
      )}

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/20 border-2 border-green-500 text-green-100'
              : 'bg-red-500/20 border-2 border-red-500 text-red-100'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form id="motor-aanvraag-form" action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-2 uppercase tracking-wider">
            Naam *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isPending}
            className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50"
            placeholder="Je volledige naam"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isPending}
            className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50"
            placeholder="je@email.nl"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-bold mb-2 uppercase tracking-wider">
            Telefoon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            disabled={isPending}
            className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50"
            placeholder="06 12345678"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold mb-2 uppercase tracking-wider">
            Bericht *
          </label>
          <textarea
            id="message"
            name="message"
            required
            disabled={isPending}
            rows={6}
            className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors resize-none disabled:opacity-50"
            placeholder={motorDetails 
              ? "Vertel ons meer over je interesse in deze motor..." 
              : "Beschrijf welke motor je zoekt..."
            }
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'VERSTUREN...' : 'VERSTUUR AANVRAAG'}
        </button>

        <p className="text-xs text-biker-light">
          * Verplichte velden. We behandelen je gegevens vertrouwelijk volgens ons{' '}
          <Link href="/privacy" className="text-biker-yellow hover:underline">
            privacybeleid
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

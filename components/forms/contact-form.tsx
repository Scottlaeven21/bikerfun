'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { sendContactEmail } from '@/app/actions/email';
import { LoadingButton } from '@/components/loading/spinner';
import { trackEvent } from '@/app/actions/analytics';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      message: `${formData.get('subject') ? `Onderwerp: ${formData.get('subject')}\n\n` : ''}${formData.get('message')}`,
    };

    startTransition(async () => {
      const result = await sendContactEmail(data);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Bericht verzonden!' });
        // Track successful form submission
        await trackEvent('contact_form_submit', {
          subject: formData.get('subject') as string,
        });
        // Reset form
        (document.getElementById('contact-form') as HTMLFormElement)?.reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Er ging iets mis.' });
      }
    });
  }

  return (
    <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
      <h2 
        style={{ fontFamily: 'var(--font-inter)' }}
        className="text-3xl font-bold mb-6 uppercase tracking-tight"
      >
        Stuur een bericht
      </h2>

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

      <form id="contact-form" action={handleSubmit} className="space-y-6">
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
          <label htmlFor="subject" className="block text-sm font-bold mb-2 uppercase tracking-wider">
            Onderwerp *
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={isPending}
            className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50"
          >
            <option value="">Selecteer een onderwerp</option>
            <option value="Vraag over een occasion">Vraag over een occasion</option>
            <option value="Motor op aanvraag">Motor op aanvraag</option>
            <option value="Motorkleding & accessoires">Motorkleding & accessoires</option>
            <option value="Service & onderhoud">Service & onderhoud</option>
            <option value="Anders">Anders</option>
          </select>
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
            placeholder="Vertel ons waar we je mee kunnen helpen..."
          />
        </div>

        <LoadingButton
          type="submit"
          loading={isPending}
          loadingText="VERSTUREN..."
          className="btn-primary w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 text-center"
        >
          VERSTUUR BERICHT
        </LoadingButton>

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

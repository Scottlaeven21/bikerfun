import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/app/actions/email';

/**
 * POST JSON contact (o.a. wachtlijst gereserveerde occasions — zie ReservedContactForm).
 * Server actions worden hier als gewone functies aangeroepen.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
    const subject = typeof body.subject === 'string' ? body.subject.trim() : undefined;
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Naam, e-mail en bericht zijn verplicht.' },
        { status: 400 }
      );
    }

    const result = await sendContactEmail({
      name,
      email,
      phone: phone || undefined,
      message,
      subject: subject || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Versturen mislukt.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message ?? 'Bericht verzonden.',
    });
  } catch (e) {
    console.error('POST /api/contact:', e);
    return NextResponse.json({ error: 'Serverfout.' }, { status: 500 });
  }
}

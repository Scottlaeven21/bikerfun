/**
 * Mollie Payment Client
 * Handles payment creation and status checking
 */

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
const BASE_URL = 'https://api.mollie.com/v2';

if (!MOLLIE_API_KEY) {
  console.warn('⚠️ MOLLIE_API_KEY not configured in environment variables');
}

interface MolliePaymentRequest {
  amount: {
    currency: string;
    value: string;
  };
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
}

interface MolliePayment {
  id: string;
  status: 'open' | 'canceled' | 'pending' | 'expired' | 'failed' | 'paid';
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  metadata: Record<string, any> | null;
  _links: {
    checkout: {
      href: string;
    };
  };
}

/**
 * Create a new Mollie payment
 */
export async function createMolliePayment(data: MolliePaymentRequest): Promise<MolliePayment> {
  if (!MOLLIE_API_KEY) {
    throw new Error('Mollie API key not configured');
  }

  const response = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mollie API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get payment status from Mollie
 */
export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  if (!MOLLIE_API_KEY) {
    throw new Error('Mollie API key not configured');
  }

  const response = await fetch(`${BASE_URL}/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${MOLLIE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mollie API error: ${response.status} - ${error}`);
  }

  return response.json();
}

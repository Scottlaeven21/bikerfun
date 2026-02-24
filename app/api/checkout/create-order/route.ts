import { NextRequest, NextResponse } from 'next/server';
import { wooCommerce } from '@/lib/woocommerce/client';

export async function POST(request: NextRequest) {
  try {
    const { customer, items, total } = await request.json();

    // Validate input
    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in WooCommerce
    const orderData = {
      payment_method: customer.paymentMethod || 'bacs',
      payment_method_title: getPaymentMethodTitle(customer.paymentMethod),
      set_paid: false,
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        postcode: customer.postcode,
        country: customer.country,
        email: customer.email,
        phone: customer.phone,
      },
      shipping: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: customer.address,
        city: customer.city,
        postcode: customer.postcode,
        country: customer.country,
      },
      line_items: items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      customer_note: customer.orderNotes || '',
    };

    const order = await wooCommerce.createOrder(orderData);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      // For now, no payment URL - we'll add Mollie/Stripe later
      paymentUrl: null,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

function getPaymentMethodTitle(method: string): string {
  switch (method) {
    case 'ideal':
      return 'iDEAL';
    case 'creditcard':
      return 'Creditcard';
    case 'bancontact':
      return 'Bancontact';
    default:
      return 'Bank Transfer';
  }
}

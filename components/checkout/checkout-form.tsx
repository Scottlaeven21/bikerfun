'use client';

import { useState } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';

interface CheckoutFormData {
  // Billing info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping address
  address: string;
  city: string;
  postcode: string;
  country: string;
  
  // Payment
  paymentMethod: 'ideal' | 'creditcard' | 'bancontact';
  
  // Notes
  orderNotes?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { cart, total: subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0); // Default to 0
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | null>(null); // null = no threshold
  const [loadingShipping, setLoadingShipping] = useState(true); // Start as loading
  
  // Calculate total with shipping
  const totalWithShipping = subtotal + shippingCost;
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'NL',
    paymentMethod: 'ideal',
    orderNotes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create order and Mollie payment via API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
          },
          billing: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.address.split(' ')[0],
            houseNumber: formData.address.split(' ').slice(1).join(' ') || '',
            postalCode: formData.postcode,
            city: formData.city,
            country: formData.country,
          },
          shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.address.split(' ')[0],
            houseNumber: formData.address.split(' ').slice(1).join(' ') || '',
            postalCode: formData.postcode,
            city: formData.city,
            country: formData.country,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fout bij aanmaken bestelling');
      }

      const { orderId, paymentUrl } = await response.json();

      // Clear cart
      clearCart();

      // Redirect to Mollie payment
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push(`/order-confirmation/${orderId}`);
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch shipping cost from WooCommerce when subtotal or country changes
  const fetchShippingCost = async (country: string) => {
    if (subtotal === 0) return;
    
    setLoadingShipping(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal, country }),
      });

      if (response.ok) {
        const data = await response.json();
        setShippingCost(data.shipping_cost ?? 0); // Default to 0 if undefined
        setFreeShippingThreshold(data.free_shipping_threshold ?? null); // null = no threshold
      } else {
        // On error, set default shipping cost
        setShippingCost(formData.country === 'NL' ? 0 : 4.95);
      }
    } catch (error) {
      console.error('Failed to fetch shipping cost:', error);
      // Keep fallback value
    } finally {
      setLoadingShipping(false);
    }
  };

  // Fetch shipping on mount and when subtotal changes
  React.useEffect(() => {
    fetchShippingCost(formData.country);
  }, [subtotal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Refetch shipping when country changes
    if (name === 'country') {
      fetchShippingCost(value);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 mb-4">Je winkelwagen is leeg</p>
        <a
          href="/products"
          className="text-biker-yellow hover:text-biker-yellowHover font-semibold underline"
        >
          Naar webshop
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Customer Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-biker-black mb-6 uppercase">
            Persoonlijke Gegevens
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Voornaam *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Achternaam *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefoon *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-biker-black mb-6 uppercase">
            Verzendadres
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Straat + Huisnummer *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Straat 123"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  placeholder="1234 AB"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plaats *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Land *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              >
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
                <option value="DE">Duitsland</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-biker-black mb-6 uppercase">
            Opmerkingen (Optioneel)
          </h2>
          
          <textarea
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleChange}
            rows={4}
            placeholder="Speciale instructies voor je bestelling..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 sticky top-24">
          <h2 className="text-2xl font-bold text-biker-black mb-6 uppercase">
            Bestelling
          </h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-3 pb-4 border-b border-gray-200">
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-biker-black truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity}x € {(parseFloat(item.product.price) || 0).toFixed(2)}
                  </p>
                  <p className="text-sm font-bold text-biker-yellow">
                    € {((parseFloat(item.product.price) || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotaal:</span>
              <span className="font-semibold">€ {(subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Verzendkosten:</span>
              <span className="font-semibold">
                {loadingShipping ? (
                  <span className="text-gray-400">Berekenen...</span>
                ) : shippingCost === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  `€ ${(shippingCost || 0).toFixed(2)}`
                )}
              </span>
            </div>
            {/* Only show "free shipping threshold" message if threshold exists and not met */}
            {!loadingShipping && 
             freeShippingThreshold !== null && 
             shippingCost > 0 && 
             subtotal < freeShippingThreshold && (
              <div className="text-xs text-gray-500 -mt-2">
                Nog €{((freeShippingThreshold || 0) - (subtotal || 0)).toFixed(2)} tot gratis verzending
              </div>
            )}
            <div className="h-px bg-gray-300 my-3"></div>
            <div className="flex justify-between text-xl font-bold text-biker-black">
              <span>Totaal:</span>
              <span className="text-biker-yellow">€ {(totalWithShipping || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-biker-black mb-3">Betaalmethode</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-biker-yellow">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ideal"
                  checked={formData.paymentMethod === 'ideal'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span className="font-semibold">iDEAL</span>
              </label>
              
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-biker-yellow">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditcard"
                  checked={formData.paymentMethod === 'creditcard'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span className="font-semibold">Creditcard</span>
              </label>
              
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-biker-yellow">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bancontact"
                  checked={formData.paymentMethod === 'bancontact'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span className="font-semibold">Bancontact</span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold py-4 rounded-full uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {isSubmitting ? 'Verwerken...' : 'Bestelling Plaatsen'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Door te bestellen ga je akkoord met onze voorwaarden
          </p>
        </div>
      </div>
    </form>
  );
}

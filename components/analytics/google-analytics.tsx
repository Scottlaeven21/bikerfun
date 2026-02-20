import Script from 'next/script';

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Only render if GA ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

// Helper function to track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

// Predefined events for Bikerfun
export const analytics = {
  // Occasion events
  viewOccasion: (occasionId: string, brand: string, model: string) => {
    trackEvent('view_occasion', {
      occasion_id: occasionId,
      brand,
      model,
    });
  },
  
  clickOccasionContact: (occasionId: string) => {
    trackEvent('occasion_contact_click', {
      occasion_id: occasionId,
    });
  },

  // Form events
  submitContactForm: () => {
    trackEvent('contact_form_submit');
  },

  submitMotorAanvraag: (motorInfo?: string) => {
    trackEvent('motor_aanvraag_submit', {
      motor_info: motorInfo,
    });
  },

  // Navigation events
  clickPhone: (location: string) => {
    trackEvent('phone_click', {
      location,
    });
  },

  clickWhatsApp: (location: string) => {
    trackEvent('whatsapp_click', {
      location,
    });
  },

  // Product events (for future WooCommerce)
  viewProduct: (productId: string, productName: string) => {
    trackEvent('view_product', {
      product_id: productId,
      product_name: productName,
    });
  },

  addToCart: (productId: string, productName: string, price: number) => {
    trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      value: price,
      currency: 'EUR',
    });
  },
};

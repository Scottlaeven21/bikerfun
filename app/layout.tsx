import type { Metadata } from "next";
import { Inter, Montserrat } from 'next/font/google';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { CartProvider } from '@/contexts/cart-context';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '600', '700', '800', '900'],
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: "Bikerfun - Motor & Biker Lifestyle Shop",
    template: "%s | Bikerfun",
  },
  description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
  keywords: ["motor", "biker", "motorkleding", "motorgear", "lifestyle"],
  authors: [{ name: "Bikerfun" }],
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://bikerfun.nl",
    siteName: "Bikerfun",
    title: "Bikerfun - Motor & Biker Lifestyle Shop",
    description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bikerfun - Motor & Biker Lifestyle Shop",
    description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${montserrat.variable} overflow-x-hidden bg-black`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased overflow-x-hidden bg-black">
        <GoogleAnalytics />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

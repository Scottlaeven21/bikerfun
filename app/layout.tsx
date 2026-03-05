import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Bikerfun - Motor & Biker Lifestyle Shop",
    template: "%s | Bikerfun",
  },
  description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
  keywords: ["motor", "biker", "motorkleding", "motorgear", "lifestyle"],
  authors: [{ name: "Bikerfun" }],
  icons: {
    icon: [
      { url: '/bikerfun-new-logo.png', sizes: 'any' },
      { url: '/bikerfun-new-logo.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/bikerfun-new-logo.png',
    apple: '/bikerfun-new-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bikerfun",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://bikerfun.nl",
    siteName: "Bikerfun",
    title: "Bikerfun - Motor & Biker Lifestyle Shop",
    description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
    images: ['/bikerfun-new-logo.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bikerfun - Motor & Biker Lifestyle Shop",
    description: "Premium motor gear en biker lifestyle producten voor echte motorliefhebbers.",
    images: ['/bikerfun-new-logo.png'],
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
        {/* Preconnect to external domains */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://www.googletagmanager.com"
        />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/hero-home.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preload"
          href="/bikerfun-new-logo.png"
          as="image"
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

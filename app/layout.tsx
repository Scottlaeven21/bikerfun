import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
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
    <html lang="nl" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

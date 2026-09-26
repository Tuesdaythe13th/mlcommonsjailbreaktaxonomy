import type { Metadata } from 'next';
import { Manrope, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'MLCommons AIRR Threat Taxonomy',
  description: 'Mechanism-first classification framework and interactive spatial atlas cataloging 113 prompt attack vectors across 4 families, 8 categories, and 18 atomic leaves.',
  openGraph: {
    title: 'MLCommons AIRR Threat Taxonomy',
    description: 'Mechanism-first classification framework and interactive spatial atlas cataloging 113 prompt attack vectors across 4 families, 8 categories, and 18 atomic leaves.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MLCommons AIRR Threat Taxonomy',
    description: 'Mechanism-first classification framework and interactive spatial atlas cataloging 113 prompt attack vectors across 4 families, 8 categories, and 18 atomic leaves.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} dark`}>
      <body suppressHydrationWarning className="bg-black text-white font-inter antialiased selection-red selection:bg-[#ef233c] selection:text-white">
        {children}
      </body>
    </html>
  );
}

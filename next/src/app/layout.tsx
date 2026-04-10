import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyBar } from '@/components/layout/StickyBar';
import { SvgRefractionDefs } from '@/components/layout/SvgRefractionDefs';

const inter = localFont({
  src: [
    { path: '../fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/inter-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-body-next',
  display: 'swap',
});

const manrope = localFont({
  src: [
    { path: '../fonts/manrope-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/manrope-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-heading-next',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedicusUnion — онлайн-консультации с европейскими врачами',
  description: 'Второе мнение от врачей Германии, Израиля, Швейцарии. Онлайн-консультация не выходя из дома.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="relative bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        <SvgRefractionDefs />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}

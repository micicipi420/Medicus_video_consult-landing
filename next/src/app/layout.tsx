import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyBar } from '@/components/layout/StickyBar';
import { SvgRefractionDefs } from '@/components/layout/SvgRefractionDefs';
import { MeshBackground } from '@/components/layout/MeshBackground';
import { LazyMotionProvider } from '@/components/motion/LazyMotionProvider';

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
  metadataBase: new URL('https://medicusunion.kz'),
  title: {
    default: 'MedicusUnion KZ \u2014 Медицина мирового уровня для Казахстана',
    template: '%s \u2014 MedicusUnion KZ',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'MedicusUnion',
  },
};

export const viewport: Viewport = {
  themeColor: '#38C6F4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-mu-text-50 text-mu-text-900 overflow-x-clip">
        <SvgRefractionDefs />
        <MeshBackground />
        <Header />
        <LazyMotionProvider>
          <main className="relative z-10 pt-24 flex flex-col gap-8 md:gap-16 pb-8">{children}</main>
        </LazyMotionProvider>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}

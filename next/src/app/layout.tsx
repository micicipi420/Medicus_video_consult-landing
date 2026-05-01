import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyBar } from '@/components/layout/StickyBar';
import { SvgRefractionDefs } from '@/components/layout/SvgRefractionDefs';
import { LivingBlobFieldDynamic } from '@/components/effects/LivingBlobFieldDynamic';
import { LazyMotionProvider } from '@/components/motion/LazyMotionProvider';

// AUDIT-01 fix (98-01): site is Russian-only — load cyrillic subset first so it
// gets preload priority. adjustFontFallback aligns Arial fallback metrics to the
// webfont, eliminating font-swap repaint that was driving the 2.7s LCP render
// delay on text-LCP routes (all 5 routes had P/H1 as the LCP element).
const inter = localFont({
  src: [
    { path: '../fonts/inter-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-body-next',
  display: 'swap',
  adjustFontFallback: 'Arial',
  preload: true,
});

const manrope = localFont({
  src: [
    { path: '../fonts/manrope-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/manrope-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-family-heading-next',
  display: 'swap',
  adjustFontFallback: 'Arial',
  preload: true,
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
        {/* v9.0 Phase 90 — seed blob runtime vars before .living-blob-field paints (FND-06) */}
        <style>{`:root{--blob-x:50vw;--blob-y:50vh;--blob-body-x:50vw;--blob-body-y:50vh;--blob-halo-x:50vw;--blob-halo-y:50vh;--blob-heat:0;--blob-velocity:0;}`}</style>
        <SvgRefractionDefs />
        <div className="living-blob-field" aria-hidden="true" data-engine-active="false">
          <div className="blob-sublayer blob-core" />
          <div className="blob-sublayer blob-body" />
          <div className="blob-sublayer blob-halo" />
          <div className="blob-sublayer blob-glint" />
          <LivingBlobFieldDynamic />
        </div>
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

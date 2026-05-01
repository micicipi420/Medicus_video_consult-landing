'use client';

import dynamic from 'next/dynamic';

/**
 * AUDIT-01 fix (98-01): client-side dynamic import wrapper for LivingBlobField.
 *
 * The blob field is purely decorative (aria-hidden) and drives a continuous
 * rAF loop + canvas compositing. By loading it via next/dynamic with
 * ssr: false, the component is excluded from the initial SSR tree and the
 * critical hydration bundle. The static .blob-sublayer divs in the parent
 * layout remain as the no-JS / pre-engine visual baseline. This frees the
 * main thread during the FCP→LCP window so the text-LCP element on every
 * route paints faster on slow-4G / 4×CPU mobile.
 *
 * `ssr: false` requires a Client Component as the importer — that is this
 * wrapper. The underlying LivingBlobField remains unchanged.
 */
const LivingBlobField = dynamic(
  () => import('./LivingBlobField').then((m) => m.LivingBlobField),
  { ssr: false }
);

export function LivingBlobFieldDynamic() {
  return <LivingBlobField />;
}

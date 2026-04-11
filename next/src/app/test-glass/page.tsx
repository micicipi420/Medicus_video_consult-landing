import { GlassInteraction } from '@/components/motion/GlassInteraction';

export default function TestGlassPage() {
  return (
    <div className="min-h-screen bg-mu-text-50 p-8 space-y-12">
      <h1 className="text-2xl font-heading">Glass Materials Test — Phase 59</h1>
      <p className="text-mu-text-500">
        Each panel below should show a frosted-glass effect (blurred gradient visible through the surface).
        If any panel appears as a plain semi-transparent box with no blur, backdrop-filter is broken.
      </p>

      {/* Gradient background for backdrop-filter to blur against */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #38C6F4 0%, #6FDEA9 33%, #FFA25C 66%, #F50057 100%)',
          minHeight: '800px',
        }}
      >
        <div className="p-8 space-y-6">
          {/* Section 1: Base materials */}
          <h2 className="text-white text-xl font-heading">Glass Materials</h2>

          {/* Specular tracking enabled */}
          <GlassInteraction className="squircle-lg liquid-regular p-6">
            <p className="font-medium">.liquid-regular</p>
            <p className="text-sm text-mu-text-500">Base material — medium blur (24px), standard opacity</p>
          </GlassInteraction>

          {/* Specular tracking enabled */}
          <GlassInteraction className="squircle-lg liquid-card p-6">
            <p className="font-medium">.liquid-card</p>
            <p className="text-sm text-mu-text-500">Card material — base + specular glint border + mouse highlight</p>
          </GlassInteraction>

          {/* Specular tracking enabled */}
          <GlassInteraction className="squircle-lg liquid-clear p-6">
            <p className="font-medium">.liquid-clear</p>
            <p className="text-sm text-mu-text-500">Clear material — highest transparency, dimming layer</p>
          </GlassInteraction>

          <div className="squircle-lg liquid-fluted p-6">
            <p className="font-medium">.liquid-fluted</p>
            <p className="text-sm text-mu-text-500">Fluted material — vertical ribbed streaks overlay</p>
          </div>

          <div className="liquid-nav p-4">
            <p className="font-medium">.liquid-nav</p>
            <p className="text-sm text-mu-text-500">Nav material — lightest blur (16px), no outer shadow</p>
          </div>

          {/* Section 2: Buttons */}
          <h2 className="text-white text-xl font-heading mt-8">Buttons</h2>

          <div className="flex gap-4 flex-wrap">
            <div className="squircle-md liquid-btn-primary px-6 py-3 inline-block cursor-pointer">
              <span className="text-white font-semibold">.liquid-btn-primary</span>
            </div>
            <div className="squircle-md liquid-btn-secondary px-6 py-3 inline-block cursor-pointer">
              <span className="font-semibold">.liquid-btn-secondary</span>
            </div>
          </div>

          {/* Section 3: Stats glass */}
          <h2 className="text-white text-xl font-heading mt-8">Stats Glass</h2>

          <div className="squircle-xl stats-glass p-6">
            <p className="font-medium">.stats-glass</p>
            <p className="text-sm text-mu-text-500">Grouped stats — large blur (40px)</p>
          </div>

          {/* Section 4: Shimmer */}
          <h2 className="text-white text-xl font-heading mt-8">Shimmer</h2>

          <div className="squircle-md liquid-btn-primary shimmer-sweep px-8 py-4 inline-block cursor-pointer">
            <span className="text-white font-semibold">Hover me — .shimmer-sweep</span>
          </div>
        </div>
      </div>

      {/* Squircle shapes test */}
      <div>
        <h2 className="text-xl font-heading mb-4">Squircle Shapes</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="squircle-md bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs text-mu-text-700">
            .squircle-md
          </div>
          <div className="squircle-lg bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs text-mu-text-700">
            .squircle-lg
          </div>
          <div className="squircle-xl bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs text-mu-text-700">
            .squircle-xl
          </div>
          <div className="squircle-full bg-mu-green-100 w-24 h-24 flex items-center justify-center text-xs text-mu-text-700">
            .squircle-full
          </div>
        </div>
      </div>

      {/* Section tint test */}
      <div>
        <h2 className="text-xl font-heading mb-4">Section Tints</h2>
        <div className="space-y-4">
          <div className="section-tint-cool p-6 rounded-lg">
            <div className="squircle-lg liquid-regular p-4">
              <p className="font-medium">.section-tint-cool + .liquid-regular</p>
              <p className="text-sm text-mu-text-500">Glass should have subtle blue tint</p>
            </div>
          </div>
          <div className="section-tint-warm p-6 rounded-lg">
            <div className="squircle-lg liquid-regular p-4">
              <p className="font-medium">.section-tint-warm + .liquid-regular</p>
              <p className="text-sm text-mu-text-500">Glass should have subtle warm tint</p>
            </div>
          </div>
          <div className="section-tint-mint p-6 rounded-lg">
            <div className="squircle-lg liquid-regular p-4">
              <p className="font-medium">.section-tint-mint + .liquid-regular</p>
              <p className="text-sm text-mu-text-500">Glass should have subtle green tint</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-sm text-mu-text-300 pt-4 border-t border-mu-text-200">
        Phase 59: Next.js Scaffold &amp; CSS Foundation — Glass test page
      </footer>
    </div>
  );
}

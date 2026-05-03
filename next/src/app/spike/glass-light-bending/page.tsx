'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const GlassLightBendingField = dynamic(
  () => import('@/components/effects/GlassLightBendingField').then((m) => m.GlassLightBendingField),
  { ssr: false }
);

/** Spike harness for /spike/glass-light-bending — see SPIKE.md */

interface DebugStats {
  fps: number;
  surfaceCount: number;
  particleCount: number;
  blobPos: { x: number; y: number };
  peakIntensity: number;
  sweetSpotIndex: number;
  enabled: boolean;
  normalStrength: number;
  tangentStrength: number;
  shininess: number;
  particlesPerSurface: number;
}

interface DebugApi {
  setEnabled: (on: boolean) => void;
  setNormalStrength: (v: number) => void;
  setTangentStrength: (v: number) => void;
  setShininess: (v: number) => void;
  setParticlesPerSurface: (n: number) => void;
}

const DEFAULTS = {
  normalStrength: 0.5,
  tangentStrength: 0.5,
  shininess: 16,
  particlesPerSurface: 24,
};

export default function GlassLightBendingSpikePage() {
  const [stats, setStats] = useState<DebugStats>({
    fps: 0,
    surfaceCount: 0,
    particleCount: 0,
    blobPos: { x: 0, y: 0 },
    peakIntensity: 0,
    sweetSpotIndex: -1,
    enabled: true,
    normalStrength: DEFAULTS.normalStrength,
    tangentStrength: DEFAULTS.tangentStrength,
    shininess: DEFAULTS.shininess,
    particlesPerSurface: DEFAULTS.particlesPerSurface,
  });
  const [enabled, setEnabled] = useState(true);
  const [compareRightOn, setCompareRightOn] = useState(false);
  const [diag, setDiag] = useState<{ rt: boolean; rm: boolean }>({ rt: false, rm: false });

  // Slider state mirrors engine state. Controlled inputs below push to engine via debug API.
  const [normalStrength, setNormalStrength] = useState(DEFAULTS.normalStrength);
  const [tangentStrength, setTangentStrength] = useState(DEFAULTS.tangentStrength);
  const [shininess, setShininess] = useState(DEFAULTS.shininess);
  const [particlesPerSurface, setParticlesPerSurface] = useState(DEFAULTS.particlesPerSurface);

  useEffect(() => {
    const rt = window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches ?? false;
    const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    setDiag({ rt, rm });
  }, []);

  // Pointer-move → drive blob position so user can steer the light source directly.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--blob-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--blob-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Push slider values to engine whenever they change.
  useEffect(() => {
    const dbg = (window as unknown as { __lightBendingDebug?: DebugApi }).__lightBendingDebug;
    dbg?.setNormalStrength(normalStrength);
  }, [normalStrength]);
  useEffect(() => {
    const dbg = (window as unknown as { __lightBendingDebug?: DebugApi }).__lightBendingDebug;
    dbg?.setTangentStrength(tangentStrength);
  }, [tangentStrength]);
  useEffect(() => {
    const dbg = (window as unknown as { __lightBendingDebug?: DebugApi }).__lightBendingDebug;
    dbg?.setShininess(shininess);
  }, [shininess]);
  useEffect(() => {
    const dbg = (window as unknown as { __lightBendingDebug?: DebugApi }).__lightBendingDebug;
    dbg?.setParticlesPerSurface(particlesPerSurface);
  }, [particlesPerSurface]);

  // Poll debug API.
  useEffect(() => {
    const id = setInterval(() => {
      const dbg = (window as unknown as { __lightBendingDebug?: DebugStats }).__lightBendingDebug;
      if (dbg) {
        setStats({
          fps: dbg.fps,
          surfaceCount: dbg.surfaceCount,
          particleCount: dbg.particleCount,
          blobPos: dbg.blobPos,
          peakIntensity: dbg.peakIntensity,
          sweetSpotIndex: dbg.sweetSpotIndex,
          enabled: dbg.enabled,
          normalStrength: dbg.normalStrength,
          tangentStrength: dbg.tangentStrength,
          shininess: dbg.shininess,
          particlesPerSurface: dbg.particlesPerSurface,
        });
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      const dbg = (window as unknown as { __lightBendingDebug?: DebugApi }).__lightBendingDebug;
      dbg?.setEnabled(next);
      return next;
    });
  }, []);

  const resetDefaults = useCallback(() => {
    setNormalStrength(DEFAULTS.normalStrength);
    setTangentStrength(DEFAULTS.tangentStrength);
    setShininess(DEFAULTS.shininess);
    setParticlesPerSurface(DEFAULTS.particlesPerSurface);
  }, []);

  return (
    <>
      <GlassLightBendingField forceMount />

      {(diag.rt || diag.rm) && (
        <div style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, padding: '10px 16px', borderRadius: 12,
          background: 'rgba(252, 230, 163, 0.95)', color: '#5a4400',
          fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)', maxWidth: 720,
        }}>
          <strong style={{ fontWeight: 700 }}>Note:</strong> Your OS has{' '}
          {diag.rt && <span><code>Reduce Transparency</code></span>}
          {diag.rt && diag.rm && ' and '}
          {diag.rm && <span><code>Reduce Motion</code></span>}
          {' '}enabled. The spike is <strong>force-mounted for evaluation</strong>{' '}
          (production component will respect these settings). Disable in
          System Settings → Accessibility → Display to test natural behavior.
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10, color: '#0d2a3a' }}>
        {/* Hero */}
        <section style={heroStyle}>
          <h1 style={h1Style}>Glass edge light-bending spike (v3)</h1>
          <p style={pStyle}>
            Edge particles are displaced toward a Blinn-Phong specular sweet-spot computed from the radial
            blob&rsquo;s position. Move cursor — watch the bright cluster slide along the edges as if light
            were bending around the corner of the glass.
          </p>
          <p style={{ ...pStyle, fontSize: 14, opacity: 0.75 }}>
            Compare:{' '}
            <a href="/spike/particle-blob" style={linkStyle}>/spike/particle-blob</a> (cursor force-field) ·{' '}
            <a href="/spike/glass-scintillation" style={linkStyle}>/spike/glass-scintillation</a> (brightness only, no displacement)
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            style={btnStyle}
          >
            Scroll down ↓
          </button>
        </section>

        {/* Section 1 — large glass panel */}
        <section style={sectionWrapStyle}>
          <h2 style={h2Style}>1 &middot; Large glass panel</h2>
          <p style={pStyle}>
            ~600 × 400. Sweet-spot tracking should be most legible here because the perimeter is long and
            corners are far apart.
          </p>
          <div data-glass-light-bending id="glass-large-panel" style={largePanelStyle}>
            <div style={panelContentStyle}>
              <strong style={{ fontSize: 24, fontFamily: 'Manrope, system-ui, sans-serif' }}>
                Liquid glass surface
              </strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Move cursor outside or just past the rectangle&rsquo;s edge. Watch the bright cluster bend
                around the nearest corner.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — two cards */}
        <section style={sectionWrapStyle}>
          <h2 style={h2Style}>2 &middot; Two cards</h2>
          <p style={pStyle}>
            Each ~280 × 320. Independent particle buckets — sweet-spot is computed per surface.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div data-glass-light-bending id="glass-card-A" style={cardStyle}>
              <strong style={cardTitleStyle}>Card A</strong>
              <p style={{ marginTop: 8 }}>Edge-anchored particles flock to the sweet-spot.</p>
            </div>
            <div data-glass-light-bending id="glass-card-B" style={cardStyle}>
              <strong style={cardTitleStyle}>Card B</strong>
              <p style={{ marginTop: 8 }}>Independent bucket from Card A.</p>
            </div>
          </div>
        </section>

        {/* Section 3 — side-by-side compare ON/OFF */}
        <section style={sectionWrapStyle}>
          <h2 style={h2Style}>3 &middot; Compare: light-bending ON vs OFF</h2>
          <p style={pStyle}>
            Same content both halves. Right half lacks the <code>data-glass-light-bending</code> attribute
            unless toggled.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div
              data-glass-light-bending
              id="glass-compare-on"
              style={{ ...comparePanelStyle, borderColor: 'rgba(53, 182, 120, 0.5)' }}
            >
              <strong style={cardTitleStyle}>ON · light-bending</strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Sweet-spot slides along edge as cursor moves; bright particles bulge outward + flock toward sweet-spot.
              </p>
            </div>
            <div
              {...(compareRightOn ? { 'data-glass-light-bending': '' } : {})}
              id="glass-compare-off"
              style={{ ...comparePanelStyle, borderColor: compareRightOn ? 'rgba(53, 182, 120, 0.5)' : 'rgba(13, 42, 58, 0.18)' }}
            >
              <strong style={cardTitleStyle}>{compareRightOn ? 'ON' : 'OFF'} · plain glass</strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Toggle to A/B compare with the left.
              </p>
              <button
                type="button"
                onClick={() => setCompareRightOn(v => !v)}
                style={{ ...btnStyle, marginTop: 12 }}
              >
                {compareRightOn ? 'Turn OFF' : 'Turn ON'} (right)
              </button>
            </div>
          </div>
        </section>

        <section style={{ ...heroStyle, minHeight: '40vh' }}>
          <p style={{ ...pStyle, opacity: 0.6 }}>
            End of harness. Goal: 60fps stable at 4 surfaces × 24 particles. Open DevTools → Performance,
            record 5s with cursor moving across surfaces.
          </p>
        </section>
      </div>

      {/* Floating dev panel with sliders */}
      <aside style={panelStyle}>
        <strong style={{ display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
          __lightBendingDebug
        </strong>
        <div style={statRow}><span>FPS</span><span style={statVal}>{stats.fps}</span></div>
        <div style={statRow}><span>Surfaces</span><span style={statVal}>{stats.surfaceCount}</span></div>
        <div style={statRow}><span>Particles</span><span style={statVal}>{stats.particleCount}</span></div>
        <div style={statRow}><span>Blob</span><span style={statVal}>{Math.round(stats.blobPos.x)},{Math.round(stats.blobPos.y)}</span></div>
        <div style={statRow}><span>PeakI</span><span style={statVal}>{stats.peakIntensity.toFixed(3)}</span></div>
        <div style={statRow}><span>SweetIdx</span><span style={statVal}>{stats.sweetSpotIndex}</span></div>

        <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <label style={sliderLabel}>
            <span>normalStrength: <code style={statVal}>{normalStrength.toFixed(2)}</code></span>
            <input
              type="range" min={0} max={1} step={0.01}
              value={normalStrength}
              onChange={(e) => setNormalStrength(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
          <label style={sliderLabel}>
            <span>tangentStrength: <code style={statVal}>{tangentStrength.toFixed(2)}</code></span>
            <input
              type="range" min={0} max={1} step={0.01}
              value={tangentStrength}
              onChange={(e) => setTangentStrength(parseFloat(e.target.value))}
              style={sliderStyle}
            />
          </label>
          <label style={sliderLabel}>
            <span>shininess: <code style={statVal}>{shininess}</code></span>
            <input
              type="range" min={8} max={64} step={1}
              value={shininess}
              onChange={(e) => setShininess(parseInt(e.target.value, 10))}
              style={sliderStyle}
            />
          </label>
          <label style={sliderLabel}>
            <span>particles/surface: <code style={statVal}>{particlesPerSurface}</code></span>
            <input
              type="range" min={12} max={40} step={1}
              value={particlesPerSurface}
              onChange={(e) => setParticlesPerSurface(parseInt(e.target.value, 10))}
              style={sliderStyle}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={resetDefaults}
          style={{ ...btnMini, marginTop: 8, width: '100%' }}
        >
          Reset to defaults
        </button>
        <button
          type="button"
          onClick={toggleEnabled}
          style={{ ...btnMini, marginTop: 6, width: '100%' }}
        >
          {enabled ? 'Disable globally' : 'Enable globally'}
        </button>
      </aside>
    </>
  );
}

// ---- styles ----

const heroStyle: React.CSSProperties = {
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 8vw',
  maxWidth: 900,
};

const sectionWrapStyle: React.CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '5vh 8vw',
  maxWidth: 1200,
};

const h1Style: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  fontFamily: 'Manrope, system-ui, sans-serif',
};

const h2Style: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  margin: 0,
  marginBottom: 12,
  fontFamily: 'Manrope, system-ui, sans-serif',
};

const pStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.55,
  marginBottom: 24,
  fontFamily: 'Inter, system-ui, sans-serif',
  color: '#1a3a4f',
  maxWidth: 720,
};

const linkStyle: React.CSSProperties = {
  color: '#1d6e4a',
  textDecoration: 'underline',
};

const btnStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '10px 20px',
  borderRadius: 999,
  border: '1px solid rgba(13, 42, 58, 0.2)',
  background: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const largePanelStyle: React.CSSProperties = {
  width: 600,
  maxWidth: '100%',
  height: 400,
  borderRadius: 32,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  background: 'var(--glass-section-fill, rgba(255,255,255,0.06))',
  backdropFilter: 'blur(var(--glass-section-blur, 16px))',
  WebkitBackdropFilter: 'blur(var(--glass-section-blur, 16px))',
  boxShadow: '0 12px 32px rgba(13, 42, 58, 0.08)',
  padding: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const panelContentStyle: React.CSSProperties = {
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  width: 280,
  height: 320,
  borderRadius: 28,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  background: 'var(--glass-card-fill, rgba(255,255,255,0.10))',
  backdropFilter: 'blur(var(--glass-card-blur, 16px))',
  WebkitBackdropFilter: 'blur(var(--glass-card-blur, 16px))',
  boxShadow: '0 12px 32px rgba(13, 42, 58, 0.08)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, system-ui, sans-serif',
  color: '#1a3a4f',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 22,
  fontFamily: 'Manrope, system-ui, sans-serif',
  fontWeight: 700,
};

const comparePanelStyle: React.CSSProperties = {
  width: 360,
  minHeight: 280,
  borderRadius: 28,
  border: '1px solid rgba(13, 42, 58, 0.18)',
  background: 'var(--glass-card-fill, rgba(255,255,255,0.10))',
  backdropFilter: 'blur(var(--glass-card-blur, 16px))',
  WebkitBackdropFilter: 'blur(var(--glass-card-blur, 16px))',
  boxShadow: '0 12px 32px rgba(13, 42, 58, 0.08)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter, system-ui, sans-serif',
  color: '#1a3a4f',
};

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 100,
  background: 'rgba(13, 42, 58, 0.92)',
  color: '#e6f0f5',
  padding: 16,
  borderRadius: 12,
  fontSize: 13,
  width: 260,
  fontFamily: 'Inter, system-ui, sans-serif',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
};

const statRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '3px 0',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  fontFamily: 'monospace',
};

const statVal: React.CSSProperties = {
  color: '#4FE098',
  fontWeight: 600,
};

const sliderLabel: React.CSSProperties = {
  display: 'block',
  marginTop: 8,
  fontFamily: 'monospace',
  fontSize: 11,
};

const sliderStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 4,
  accentColor: '#35B678',
};

const btnMini: React.CSSProperties = {
  fontSize: 11,
  padding: '6px 8px',
  borderRadius: 6,
  border: 'none',
  background: 'rgba(255,255,255,0.12)',
  color: 'white',
  cursor: 'pointer',
  fontFamily: 'monospace',
};

'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const GlassScintillationField = dynamic(
  () => import('@/components/effects/GlassScintillationField').then((m) => m.GlassScintillationField),
  { ssr: false }
);

/** Spike harness for /spike/glass-scintillation — see SPIKE.md */

interface DebugStats {
  fps: number;
  surfaceCount: number;
  particleCount: number;
  blobPos: { x: number; y: number };
  intensityAvg: number;
  enabled: boolean;
}

export default function GlassScintillationSpikePage() {
  const [stats, setStats] = useState<DebugStats>({
    fps: 0,
    surfaceCount: 0,
    particleCount: 0,
    blobPos: { x: 0, y: 0 },
    intensityAvg: 0,
    enabled: true,
  });
  const [enabled, setEnabled] = useState(true);
  const [compareRightOn, setCompareRightOn] = useState(false);

  // Mouse-move → drive blob position (LivingBlobField will overwrite next frame, but
  // for this spike we want immediate cursor coupling so user can see scintillation react).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--blob-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--blob-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Poll debug API.
  useEffect(() => {
    const id = setInterval(() => {
      const dbg = (window as unknown as { __scintillationDebug?: DebugStats }).__scintillationDebug;
      if (dbg) {
        setStats({
          fps: dbg.fps,
          surfaceCount: dbg.surfaceCount,
          particleCount: dbg.particleCount,
          blobPos: dbg.blobPos,
          intensityAvg: dbg.intensityAvg,
          enabled: dbg.enabled,
        });
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      const dbg = (window as unknown as { __scintillationDebug?: { setEnabled: (on: boolean) => void } }).__scintillationDebug;
      dbg?.setEnabled(next);
      return next;
    });
  }, []);

  return (
    <>
      <GlassScintillationField />

      <div style={{ position: 'relative', zIndex: 10, color: '#0d2a3a' }}>
        {/* Hero */}
        <section style={heroStyle}>
          <h1 style={h1Style}>Glass scintillation spike</h1>
          <p style={pStyle}>
            Edge-anchored particles catch light from the radial blob behind. Move the cursor to
            steer the blob; watch glass edges brighten when the &ldquo;lamp&rdquo; passes behind them.
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
            ~600 × 400. Uses <code>--glass-section-fill</code> + <code>--glass-section-blur</code>. 24
            edge-anchored particles drift along the perimeter; brightness modulates with cursor proximity.
          </p>
          <div
            data-glass-scintillation
            id="glass-large-panel"
            style={largePanelStyle}
          >
            <div style={panelContentStyle}>
              <strong style={{ fontSize: 24, fontFamily: 'Manrope, system-ui, sans-serif' }}>
                Liquid glass surface
              </strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Section-fill token. Move cursor across the rectangle to see edge particles brighten.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — two cards side-by-side */}
        <section style={sectionWrapStyle}>
          <h2 style={h2Style}>2 &middot; Two cards side-by-side</h2>
          <p style={pStyle}>
            Each ~280 × 320. Uses <code>--glass-card-fill</code> + <code>--glass-card-blur</code>. 24
            particles per card → 48 total in this row.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div
              data-glass-scintillation
              id="glass-card-A"
              style={cardStyle}
            >
              <strong style={cardTitleStyle}>Card A</strong>
              <p style={{ marginTop: 8 }}>Card-fill token. Edge-anchored particles.</p>
            </div>
            <div
              data-glass-scintillation
              id="glass-card-B"
              style={cardStyle}
            >
              <strong style={cardTitleStyle}>Card B</strong>
              <p style={{ marginTop: 8 }}>Independent particle bucket from Card A.</p>
            </div>
          </div>
        </section>

        {/* Section 3 — side-by-side compare ON/OFF */}
        <section style={sectionWrapStyle}>
          <h2 style={h2Style}>3 &middot; Compare: scintillation ON vs OFF</h2>
          <p style={pStyle}>
            Same content both halves. Right half is rendered as a plain glass surface without the
            <code> data-glass-scintillation</code> attribute when toggled OFF.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div
              data-glass-scintillation
              id="glass-compare-on"
              style={{ ...comparePanelStyle, borderColor: 'rgba(53, 182, 120, 0.5)' }}
            >
              <strong style={cardTitleStyle}>ON · scintillation</strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Edge particles active. Cursor proximity drives intensity 0.3 → 1.0.
              </p>
            </div>
            <div
              {...(compareRightOn ? { 'data-glass-scintillation': '' } : {})}
              id="glass-compare-off"
              style={{ ...comparePanelStyle, borderColor: compareRightOn ? 'rgba(53, 182, 120, 0.5)' : 'rgba(13, 42, 58, 0.18)' }}
            >
              <strong style={cardTitleStyle}>{compareRightOn ? 'ON' : 'OFF'} · plain glass</strong>
              <p style={{ marginTop: 8, color: '#1a3a4f' }}>
                Toggle scintillation on the right to A/B compare.
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
            End of spike harness. Open DevTools → Performance, record 5s with cursor moving across
            surfaces, check FPS. Goal: 60fps stable with 5 surfaces × 24 particles = 120 particles.
          </p>
        </section>
      </div>

      {/* Floating dev panel */}
      <aside style={panelStyle}>
        <strong style={{ display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
          __scintillationDebug
        </strong>
        <div style={statRow}><span>FPS</span><span style={statVal}>{stats.fps}</span></div>
        <div style={statRow}><span>Surfaces</span><span style={statVal}>{stats.surfaceCount}</span></div>
        <div style={statRow}><span>Particles</span><span style={statVal}>{stats.particleCount}</span></div>
        <div style={statRow}><span>Blob</span><span style={statVal}>{Math.round(stats.blobPos.x)},{Math.round(stats.blobPos.y)}</span></div>
        <div style={statRow}><span>Intensity</span><span style={statVal}>{stats.intensityAvg.toFixed(2)}</span></div>
        <button
          type="button"
          onClick={toggleEnabled}
          style={{ ...btnMini, marginTop: 8, width: '100%' }}
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
  width: 230,
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

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Morph } from '@/lib/blob-engine/particle-renderer';

const ParticleBlobField = dynamic(
  () => import('@/components/effects/ParticleBlobField').then((m) => m.ParticleBlobField),
  { ssr: false }
);

/** Spike harness for /spike/particle-blob — see SPIKE.md */
export default function SpikePage() {
  const apiRef = useRef<{ morphTo: (form: Morph) => void } | null>(null);
  const section2Ref = useRef<HTMLElement | null>(null);
  const [stats, setStats] = useState({ fps: 0, count: 800, morph: 'cloud' as Morph, progress: 0 });
  const [particleCount, setParticleCount] = useState(800);

  // Section 2 IntersectionObserver — morph to heart when in view.
  useEffect(() => {
    const target = section2Ref.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            apiRef.current?.morphTo('heart');
          } else if (!entry.isIntersecting) {
            apiRef.current?.morphTo('cloud');
          }
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Poll debug API for live stats.
  useEffect(() => {
    const id = setInterval(() => {
      const dbg = (window as unknown as { __particleBlobDebug?: { fps: number; particleCount: number; currentMorph: Morph; morphProgress: number } }).__particleBlobDebug;
      if (dbg) {
        setStats({ fps: dbg.fps, count: dbg.particleCount, morph: dbg.currentMorph, progress: dbg.morphProgress });
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  const onSliderChange = (n: number) => {
    setParticleCount(n);
    const dbg = (window as unknown as { __particleBlobDebug?: { setParticleCount: (n: number) => void } }).__particleBlobDebug;
    dbg?.setParticleCount(n);
  };

  const handleClickShowHeart = () => {
    apiRef.current?.morphTo('heart');
    setTimeout(() => apiRef.current?.morphTo('cloud'), 2000);
  };

  return (
    <>
      <ParticleBlobField initialMorph="cloud" onReady={(api) => { apiRef.current = api; }} />

      <main style={{ position: 'relative', zIndex: 1, color: '#0d2a3a' }}>
        {/* Hero */}
        <section style={sectionStyle}>
          <h1 style={h1Style}>Particle blob spike</h1>
          <p style={pStyle}>Cloud-default + heart morph. Move the cursor to disturb the cloud.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            style={btnStyle}
          >
            Scroll down ↓
          </button>
        </section>

        {/* Section 1 — cloud form */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>1 · Cloud form</h2>
          <p style={pStyle}>
            Default state: ~800 particles drifting in a Gaussian cloud,
            spring-attracted to anchors with subtle per-particle phase.
            Cursor pushes a 180px force-field that locally repels.
          </p>
        </section>

        {/* Section 2 — scroll-driven heart */}
        <section ref={section2Ref} style={sectionStyle}>
          <h2 style={h2Style}>2 · Scroll-driven heart</h2>
          <p style={pStyle}>
            When this section enters viewport (over 50%), the blob morphs to a heart
            over ~600ms. Heart pulses at ~70 bpm (1.2s period, scale 1.0→1.06).
            Scroll back up to revert to cloud.
          </p>
        </section>

        {/* Section 3 — click-driven heart */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>3 · Click-driven heart</h2>
          <p style={pStyle}>Click the button — heart for 2s, then cloud.</p>
          <button type="button" onClick={handleClickShowHeart} style={btnPrimary}>
            Show heart
          </button>
        </section>
      </main>

      {/* Floating dev panel */}
      <aside style={panelStyle}>
        <strong style={{ display: 'block', marginBottom: 8, fontFamily: 'monospace' }}>
          __particleBlobDebug
        </strong>
        <div style={statRow}><span>FPS</span><span style={statVal}>{stats.fps}</span></div>
        <div style={statRow}><span>Particles</span><span style={statVal}>{stats.count}</span></div>
        <div style={statRow}><span>Form</span><span style={statVal}>{stats.morph}</span></div>
        <div style={statRow}><span>Morph</span><span style={statVal}>{stats.progress.toFixed(2)}</span></div>
        <label style={{ display: 'block', marginTop: 12, fontSize: 12, fontFamily: 'monospace' }}>
          count: {particleCount}
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={particleCount}
            onChange={(e) => onSliderChange(+e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button type="button" onClick={() => apiRef.current?.morphTo('cloud')} style={btnMini}>cloud</button>
          <button type="button" onClick={() => apiRef.current?.morphTo('heart')} style={btnMini}>heart</button>
        </div>
      </aside>
    </>
  );
}

const sectionStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 8vw',
  maxWidth: 720,
};

const h1Style: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  fontFamily: 'Manrope, system-ui, sans-serif',
};

const h2Style: React.CSSProperties = {
  fontSize: 44,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  fontFamily: 'Manrope, system-ui, sans-serif',
};

const pStyle: React.CSSProperties = {
  fontSize: 20,
  lineHeight: 1.55,
  marginBottom: 24,
  fontFamily: 'Inter, system-ui, sans-serif',
  color: '#1a3a4f',
};

const btnStyle: React.CSSProperties = {
  fontSize: 16,
  padding: '12px 24px',
  borderRadius: 999,
  border: '1px solid rgba(13, 42, 58, 0.2)',
  background: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const btnPrimary: React.CSSProperties = {
  ...btnStyle,
  background: '#35B678',
  color: 'white',
  border: 'none',
  fontWeight: 600,
};

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 10,
  background: 'rgba(13, 42, 58, 0.92)',
  color: '#e6f0f5',
  padding: 16,
  borderRadius: 12,
  fontSize: 13,
  width: 220,
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
  flex: 1,
  fontSize: 11,
  padding: '6px 8px',
  borderRadius: 6,
  border: 'none',
  background: 'rgba(255,255,255,0.12)',
  color: 'white',
  cursor: 'pointer',
  fontFamily: 'monospace',
};

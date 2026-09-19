'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const start = () => {
    setNavigating(true);
    router.push('/character');
  };

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        backgroundImage:
          "linear-gradient(rgba(40,10,50,0.35), rgba(20,8,40,0.55)), url('/background1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        fontFamily: 'var(--font-rounded), system-ui, sans-serif',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Preload the hero + editor base images so they paint fast. */}
      <link rel="preload" as="image" href="/background1.jpg" />
      <link rel="preload" as="image" href="/avatars/male_base.jpg" />
      <link rel="preload" as="image" href="/avatars/female_base.jpg" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, lineHeight: 1 }}>
        <h1 style={{ fontSize: 'clamp(48px, 12vw, 120px)', fontWeight: 900, letterSpacing: 4, margin: 0, textShadow: '2px 2px 0px rgba(255,47,176,0.6), 4px 4px 0px rgba(34,230,200,0.35)', transform: 'skewX(-5deg)' }}>GTA 67</h1>
        <h2 style={{ fontSize: 'clamp(32px, 7vw, 72px)', fontWeight: 900, letterSpacing: 2, margin: 0, textShadow: '2px 2px 0px rgba(255,47,176,0.6), 4px 4px 0px rgba(34,230,200,0.35)', transform: 'skewX(-5deg)', opacity: 0.92 }}>Miami Drive</h2>
      </div>
      <p style={{ opacity: 0.88, maxWidth: '90%', fontSize: 'clamp(14px, 2.5vw, 18px)', lineHeight: 1.5, margin: '8px 0 0 0' }}>
        Customize your driver, hit the coastal highway at sunset.
      </p>
      <button
        onClick={start}
        disabled={navigating}
        style={{
          padding: '14px 40px',
          borderRadius: 999,
          background: navigating ? 'rgba(255,255,255,0.75)' : 'white',
          color: '#1a0f2e',
          fontWeight: 800,
          fontSize: 18,
          border: 'none',
          cursor: navigating ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {navigating && <span className="gta67-spinner small" />}
        {navigating ? 'Loading…' : 'Start'}
      </button>

      {navigating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20,8,40,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            zIndex: 50,
          }}
        >
          <div className="gta67-spinner" />
          <div style={{ fontWeight: 800, letterSpacing: 1 }}>Warming up the editor…</div>
        </div>
      )}
    </main>
  );
}

'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url('/background1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: 4, margin: 0, textShadow: '2px 2px 0px rgba(255,0,0,0.5), 4px 4px 0px rgba(0,255,255,0.3)', transform: 'skewX(-5deg)' }}>GTA 67 Drive</h1>
      <p style={{ opacity: 0.85, maxWidth: 420 }}>
        Pick your driver, customize your look, hit the coastal highway at sunset.
      </p>
      <Link
        href="/character"
        style={{
          padding: '14px 36px',
          borderRadius: 999,
          background: 'white',
          color: '#1a0f2e',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Start
      </Link>
    </main>
  );
}
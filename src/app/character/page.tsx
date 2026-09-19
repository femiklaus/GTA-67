'use client';
import { CharacterEditor } from '@/components/character/CharacterEditor';

export default function CharacterPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        // GTA IV / Vice-City sunset
        background:
          'radial-gradient(circle at 50% 0%, #ff9a5a 0%, #ff2fb0 35%, #7b2fe0 70%, #241a3f 100%)',
        fontFamily: 'sans-serif',
        paddingTop: 8,
      }}
    >
      <h1
        style={{
          color: 'white',
          textAlign: 'center',
          paddingTop: 30,
          fontSize: 'clamp(28px, 6vw, 46px)',
          fontWeight: 900,
          textShadow: '0 3px 0 rgba(0,0,0,0.2)',
          margin: 0,
          transform: 'skewX(-5deg)',
        }}
      >
        Customize your driver
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          margin: '6px 0 20px',
          fontSize: 'clamp(14px, 3vw, 18px)',
          fontWeight: 600,
        }}
      >
        Edit your character in the image editor, then hit the road at sunset
      </p>
      <CharacterEditor />
    </main>
  );
}

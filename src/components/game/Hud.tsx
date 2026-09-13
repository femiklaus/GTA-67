'use client';
import { useGameStore } from '@/lib/store';

export function Hud() {
  const avatarDataUrl = useGameStore((s) => s.avatarDataUrl);
  const score = useGameStore((s) => s.score);
  const crashed = useGameStore((s) => s.crashed);
  const resetRun = useGameStore((s) => s.resetRun);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: 'sans-serif' }}>
      {avatarDataUrl && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 60,
            borderRadius: 12,
            border: '3px solid rgba(255,255,255,0.6)',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <img src={avatarDataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ffd23f',
          fontWeight: 800,
          fontSize: 'clamp(20px, 4vw, 28px)',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        🪙 {score}
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: 13, opacity: 0.75 }}>
        Steer with the arrows, brake on the left
      </div>

      {crashed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            pointerEvents: 'auto',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900 }}>Crashed!</div>
          <div style={{ fontSize: 18 }}>Score: {score}</div>
          <button
            onClick={resetRun}
            style={{
              padding: '12px 32px',
              borderRadius: 999,
              background: '#ff2b2b',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
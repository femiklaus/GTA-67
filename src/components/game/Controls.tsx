'use client';
import type { PointerEvent, CSSProperties } from 'react';
import { useGameStore } from '@/lib/store';

export function Controls() {
  const setControl = useGameStore((s) => s.setControl);

  const bind = (key: 'left' | 'right' | 'brake') => ({
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault();
      setControl(key, true);
    },
    onPointerUp: () => setControl(key, false),
    onPointerLeave: () => setControl(key, false),
    onPointerCancel: () => setControl(key, false),
  });

  const buttonStyle: CSSProperties = {
    width: 'clamp(56px, 12vw, 76px)',
    height: 'clamp(56px, 12vw, 76px)',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.35)',
    background: 'rgba(20,20,24,0.55)',
    color: 'white',
    fontSize: 'clamp(20px, 4.5vw, 28px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'none',
    backdropFilter: 'blur(4px)',
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          right: 'max(16px, env(safe-area-inset-right))',
          bottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          zIndex: 10,
        }}
      >
        <button style={buttonStyle} {...bind('right')} aria-label="Steer right">➜</button>
        <button style={{ ...buttonStyle, transform: 'scaleX(-1)' }} {...bind('left')} aria-label="Steer left">➜</button>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 'max(16px, env(safe-area-inset-left))',
          bottom: 'max(24px, env(safe-area-inset-bottom))',
          zIndex: 10,
        }}
      >
        <button
          style={{
            ...buttonStyle,
            borderRadius: 16,
            background: 'rgba(255,45,45,0.55)',
            fontSize: 'clamp(12px, 3vw, 15px)',
            fontWeight: 800,
          }}
          {...bind('brake')}
          aria-label="Brake"
        >
          BRAKE
        </button>
      </div>
    </>
  );
}
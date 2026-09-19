'use client';
import type { PointerEvent, CSSProperties } from 'react';
import { useGameStore } from '@/lib/store';

export function Controls() {
  const setControl = useGameStore((s) => s.setControl);

  const bind = (key: 'left' | 'right' | 'accelerate' | 'brake') => ({
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

  // All control clusters sit on one raised plane, leaving clear space beneath
  // the steering buttons for the instruction line.
  const RAISED = 'max(78px, calc(env(safe-area-inset-bottom) + 78px))';

  return (
    <>
      {/* left cluster: GAS + BRAKE side by side on the raised plane */}
      <div
        style={{
          position: 'absolute',
          left: 'max(16px, env(safe-area-inset-left))',
          bottom: RAISED,
          display: 'flex',
          flexDirection: 'row',
          gap: 14,
          zIndex: 10,
        }}
      >
        <button
          style={{
            ...buttonStyle,
            borderRadius: 16,
            background: 'rgba(34, 197, 94, 0.55)',
            fontSize: 'clamp(12px, 3vw, 15px)',
            fontWeight: 800,
          }}
          {...bind('accelerate')}
          aria-label="Accelerate"
        >
          GAS
        </button>
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

      {/* right cluster: LEFT + RIGHT side by side, raised, with instructions
          directly underneath them */}
      <div
        style={{
          position: 'absolute',
          right: 'max(16px, env(safe-area-inset-right))',
          bottom: RAISED,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: 14 }}>
          <button style={{ ...buttonStyle, transform: 'scaleX(-1)' }} {...bind('left')} aria-label="Steer left">➜</button>
          <button style={buttonStyle} {...bind('right')} aria-label="Steer right">➜</button>
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 12,
            opacity: 0.75,
            textAlign: 'right',
            lineHeight: 1.3,
            maxWidth: 200,
            pointerEvents: 'none',
          }}
        >
          Steer with the arrows.<br />Gas and brake on the left.
        </div>
      </div>
    </>
  );
}
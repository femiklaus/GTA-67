'use client';
import { useGameStore } from '@/lib/store';

export function Hud() {
  const avatarDataUrl = useGameStore((s) => s.avatarDataUrl);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: 'sans-serif' }}>
      {/* rearview-mirror style avatar portrait */}
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
      <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: 14, opacity: 0.8 }}>
        Arrow keys / A-D to steer
      </div>
    </div>
  );
}
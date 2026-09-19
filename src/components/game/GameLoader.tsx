'use client';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

/*
  Full-screen loading veil shown over the game canvas until the 3D world
  (car + GLB assets) has finished loading, so the player never stares at a
  blank/half-built scene. Driven by drei's useProgress, which tracks THREE's
  default loading manager (every useGLTF goes through it).
*/
// Hard ceiling so the veil can NEVER trap the player, even if useProgress
// miscounts (waves of GLB loads, a silently-failed asset, a cached decode that
// never fires onLoad). On real hardware the scene finishes in ~1-2s; this is a
// generous safety net, not the normal path.
const MAX_VEIL_MS = 14000;

export function GameLoader() {
  const { active, progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [expired, setExpired] = useState(false);

  const done = (!active && progress >= 100) || expired;

  // Absolute fallback: lift the veil after MAX_VEIL_MS no matter what.
  useEffect(() => {
    const id = setTimeout(() => setExpired(true), MAX_VEIL_MS);
    return () => clearTimeout(id);
  }, []);

  // Fade out once loading is done (or the cap hit); a tiny linger avoids a flash.
  useEffect(() => {
    if (done) {
      const id = setTimeout(() => setHidden(true), 400);
      return () => clearTimeout(id);
    }
    setHidden(false);
  }, [done]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        background:
          'radial-gradient(circle at 50% 30%, #ff5fa2 0%, #a03bd6 45%, #241a3f 100%)',
        color: 'white',
        fontFamily: 'var(--font-rounded), system-ui, sans-serif',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}
    >
      <div className="gta67-spinner" />
      <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 1, transform: 'skewX(-5deg)' }}>
        Loading Miami…
      </div>
      <div style={{ opacity: 0.85, fontSize: 14 }}>{Math.round(progress)}%</div>
    </div>
  );
}

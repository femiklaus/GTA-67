'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BUILDING_CONFIG } from '@/config/environment.config';

// Bakes a window-grid texture per building — lit windows scattered randomly
// against a dark facade, which is what actually reads as "skyscraper at
// night" rather than a flat colored box.
function buildFacadeTexture(baseColor: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 64, 128);

  const cols = 6;
  const rows = 14;
  const cellW = 64 / cols;
  const cellH = 128 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = Math.random() < BUILDING_CONFIG.windowLitChance;
      ctx.fillStyle = lit ? '#ffe27a' : 'rgba(0,0,0,0.35)';
      ctx.fillRect(c * cellW + 2, r * cellH + 2, cellW - 4, cellH - 4);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function Buildings() {
  const buildings = useMemo(() => {
    return Array.from({ length: BUILDING_CONFIG.count }).map((_, i) => {
      const angle = (i / BUILDING_CONFIG.count) * Math.PI * 2;
      const r = BUILDING_CONFIG.radius + (Math.random() - 0.5) * 60;
      const height =
        BUILDING_CONFIG.heightRange[0] +
        Math.random() * (BUILDING_CONFIG.heightRange[1] - BUILDING_CONFIG.heightRange[0]);
      const width = 14 + Math.random() * 20;
      const baseColor =
        BUILDING_CONFIG.colorPalette[Math.floor(Math.random() * BUILDING_CONFIG.colorPalette.length)];
      const neonColor =
        BUILDING_CONFIG.neonTrimColors[Math.floor(Math.random() * BUILDING_CONFIG.neonTrimColors.length)];
      return {
        position: [Math.sin(angle) * r, height / 2, -Math.cos(angle) * r] as [number, number, number],
        width,
        height,
        texture: buildFacadeTexture(baseColor),
        neonColor,
      };
    });
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={b.position}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.width]} />
            <meshStandardMaterial map={b.texture} roughness={0.6} />
          </mesh>
          {/* neon rooftop trim — the classic Vice City skyline glow */}
          <mesh position={[0, b.height / 2 + 0.3, 0]}>
            <boxGeometry args={[b.width * 1.02, 0.6, b.width * 1.02]} />
            <meshStandardMaterial color={b.neonColor} emissive={b.neonColor} emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
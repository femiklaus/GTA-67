'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { PALM_CONFIG } from '@/config/environment.config';

// Built once and reused by every tree instance — a soft leaf-shaped alpha
// mask so fronds read as tapered leaves instead of geometric cones.
let frondTextureCache: THREE.Texture | null = null;
function getFrondTexture() {
  if (frondTextureCache) return frondTextureCache;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 256);

  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, PALM_CONFIG.frondColorTop);
  gradient.addColorStop(1, PALM_CONFIG.frondColorBottom);
  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(64, 256);
  ctx.quadraticCurveTo(10, 160, 30, 40);
  ctx.quadraticCurveTo(64, 0, 98, 40);
  ctx.quadraticCurveTo(118, 160, 64, 256);
  ctx.closePath();
  ctx.fill();

  // center vein for a bit of leaf detail
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(64, 250);
  ctx.lineTo(64, 20);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  frondTextureCache = tex;
  return tex;
}

export function PalmTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkH =
    PALM_CONFIG.trunkHeight[0] + Math.random() * (PALM_CONFIG.trunkHeight[1] - PALM_CONFIG.trunkHeight[0]);
  const frondTexture = useMemo(() => getFrondTexture(), []);
  const lean = (Math.random() - 0.5) * PALM_CONFIG.windLean;

  // A gently curved trunk built from a few stacked, incrementally-angled
  // segments — reads far more organic than one straight cylinder.
  const trunkSegments = 5;
  const segHeight = trunkH / trunkSegments;

  return (
    <group position={position} scale={scale} rotation={[0, Math.random() * Math.PI * 2, 0]}>
      <group rotation={[0, 0, lean]}>
        {Array.from({ length: trunkSegments }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 0.3) * 0.15, segHeight * i + segHeight / 2, 0]}
            rotation={[0, 0, i * 0.05]}
            castShadow
          >
            <cylinderGeometry
              args={[0.16 - i * 0.015, 0.22 - i * 0.015, segHeight, 6]}
            />
            <meshStandardMaterial color={PALM_CONFIG.trunkColor} roughness={1} />
          </mesh>
        ))}

        {Array.from({ length: PALM_CONFIG.frondCount }).map((_, i) => {
          const angle = (i / PALM_CONFIG.frondCount) * Math.PI * 2;
          const droop = 0.55 + Math.random() * 0.25;
          return (
            <mesh
              key={i}
              position={[0, trunkH, 0]}
              rotation={[droop, angle, 0]}
            >
              <planeGeometry args={[PALM_CONFIG.frondWidth, PALM_CONFIG.frondLength]} />
              <meshStandardMaterial
                map={frondTexture}
                transparent
                alphaTest={0.3}
                side={THREE.DoubleSide}
                roughness={0.8}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BUILDING_CONFIG } from '@/config/environment.config';

export function Buildings() {
  const buildings = useMemo(() => {
    return Array.from({ length: BUILDING_CONFIG.count }).map((_, i) => {
      const angle = (i / BUILDING_CONFIG.count) * Math.PI * 2;
      const r = BUILDING_CONFIG.radius + (Math.random() - 0.5) * 60;
      const height =
        BUILDING_CONFIG.heightRange[0] +
        Math.random() * (BUILDING_CONFIG.heightRange[1] - BUILDING_CONFIG.heightRange[0]);
      const color =
        BUILDING_CONFIG.colorPalette[
          Math.floor(Math.random() * BUILDING_CONFIG.colorPalette.length)
        ];
      return {
        position: [Math.sin(angle) * r, height / 2, -Math.cos(angle) * r] as [number, number, number],
        width: 14 + Math.random() * 20,
        height,
        color,
      };
    });
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position}>
          <boxGeometry args={[b.width, b.height, b.width]} />
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}
'use client';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CAR_CONFIG } from '@/config/car.config';
import { CHARACTER_CONFIG } from '@/config/character.config';
import { useGameStore } from '@/lib/store';
import { Model as CarAsset } from './CarAsset';

export function CarModel() {
  const { height, length } = CAR_CONFIG.dimensions;
  const avatarDataUrl = useGameStore((s) => s.avatarDataUrl);
  const braking = useGameStore((s) => s.controls.brake);
  const [driverTexture, setDriverTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!avatarDataUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(avatarDataUrl, (tex) => setDriverTexture(tex));
  }, [avatarDataUrl]);

  return (
    <group>
      <Suspense fallback={null}>
      <CarAsset
  scale={CAR_CONFIG.assetScale}
  position={[0, CAR_CONFIG.assetYOffset, 0]}
  rotation={[CAR_CONFIG.assetRotationX, CAR_CONFIG.assetRotationY, CAR_CONFIG.assetRotationZ]}
  color={CAR_CONFIG.bodyColor}
/>
      </Suspense>

      {driverTexture && (
        <mesh position={CHARACTER_CONFIG.driverPlane.position}>
          <planeGeometry args={CHARACTER_CONFIG.driverPlane.size} />
          <meshBasicMaterial map={driverTexture} transparent />
        </mesh>
      )}

      {/* Brake glow — a simple emissive plane overlaid near the rear, since the real
          model's own material isn't ours to reassign brightness on. Reposition the
          z-value once you see where the asset's actual rear sits relative to origin. */}
      <mesh position={[0, height * 0.5, length / 2 - 0.1]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial
          color={CAR_CONFIG.tailLightColor}
          emissive={CAR_CONFIG.tailLightColor}
          emissiveIntensity={braking ? 4 : 1.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
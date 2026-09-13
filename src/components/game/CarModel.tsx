'use client';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { CAR_CONFIG } from '@/config/car.config';
import { CHARACTER_CONFIG } from '@/config/character.config';
import { useGameStore } from '@/lib/store';

export function CarModel() {
  const { length, width, height } = CAR_CONFIG.dimensions;
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
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height * 0.6, length]} />
        <meshStandardMaterial color={CAR_CONFIG.bodyColor} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, height * 0.95, -length * 0.05]} castShadow>
        <boxGeometry args={[width * 0.85, height * 0.55, length * 0.5]} />
        <meshStandardMaterial color={CAR_CONFIG.cabinColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {driverTexture && (
        <mesh position={CHARACTER_CONFIG.driverPlane.position}>
          <planeGeometry args={CHARACTER_CONFIG.driverPlane.size} />
          <meshBasicMaterial map={driverTexture} transparent />
        </mesh>
      )}

      {[
        [-width / 2, 0.35, length / 2 - 0.6],
        [width / 2, 0.35, length / 2 - 0.6],
        [-width / 2, 0.35, -length / 2 + 0.6],
        [width / 2, 0.35, -length / 2 + 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
          <meshStandardMaterial color={CAR_CONFIG.wheelColor} roughness={0.9} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.15), height / 2, length / 2 - 0.05]}>
          <boxGeometry args={[0.25, 0.15, 0.05]} />
          <meshStandardMaterial
            color={CAR_CONFIG.tailLightColor}
            emissive={CAR_CONFIG.tailLightColor}
            emissiveIntensity={braking ? 4 : 1.2}
          />
        </mesh>
      ))}
    </group>
  );
}
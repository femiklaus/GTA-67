'use client';
import { PALM_CONFIG } from '@/config/environment.config';

export function PalmTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkH = PALM_CONFIG.trunkHeight[0] +
    Math.random() * (PALM_CONFIG.trunkHeight[1] - PALM_CONFIG.trunkHeight[0]);

  return (
    <group position={position} scale={scale}>
      {/* trunk, slightly tilted for a windswept look */}
      <mesh position={[0, trunkH / 2, 0]} rotation={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, trunkH, 6]} />
        <meshStandardMaterial color={PALM_CONFIG.trunkColor} roughness={1} />
      </mesh>
      {/* fronds fanning out from the top */}
      {Array.from({ length: PALM_CONFIG.frondCount }).map((_, i) => {
        const angle = (i / PALM_CONFIG.frondCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[0, trunkH, 0]}
            rotation={[Math.PI / 2.6, 0, angle]}
            castShadow
          >
            <coneGeometry args={[0.5, 3.4, 4]} />
            <meshStandardMaterial color={PALM_CONFIG.frondColor} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}
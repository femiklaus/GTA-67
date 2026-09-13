'use client';
import type { WorldItem } from '@/lib/use-gameplay-objects';

export function Obstacles({ items }: { items: WorldItem[] }) {
  return (
    <group>
      {items.map((item, i) => (
        <group key={i} position={item.position}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <coneGeometry args={[0.55, 1.2, 12]} />
            <meshStandardMaterial color="#ff5a1f" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <torusGeometry args={[0.4, 0.06, 8, 16]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { WorldItem } from '@/lib/use-gameplay-objects';

function Coin({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 2.4;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 20]} />
        <meshStandardMaterial color="#ffd23f" emissive="#ffb700" emissiveIntensity={0.4} metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Coins({ items, collected }: { items: WorldItem[]; collected: boolean[] }) {
  return (
    <group>
      {items.map((item, i) =>
        collected[i] ? null : (
          <Coin key={i} position={[item.position.x, 1.1, item.position.z]} />
        )
      )}
    </group>
  );
}
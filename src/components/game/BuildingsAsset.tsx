'use client';
import { useMemo } from 'react';
import { Model as Storey1 } from './1storeyAsset';
import { Model as Storey10 } from './10storeyAsset';
import { Model as StoreyGeneric } from './storeyAsset';
import { BUILDING_ASSET_CONFIGS } from '@/config/assets.config';
import { GroundedAsset } from './GroundedAsset';
import { BUILDING_CONFIG } from '@/config/environment.config';

const VARIANTS = [
  { Asset: Storey1, config: BUILDING_ASSET_CONFIGS.storey1 },
  { Asset: Storey10, config: BUILDING_ASSET_CONFIGS.storey10 },
  { Asset: StoreyGeneric, config: BUILDING_ASSET_CONFIGS.storeyGeneric },
];

export function BuildingsAsset() {
  const buildings = useMemo(() => {
    return Array.from({ length: BUILDING_CONFIG.count }).map((_, i) => {
      const angle = (i / BUILDING_CONFIG.count) * Math.PI * 2;
      const r = BUILDING_CONFIG.radius + (Math.random() - 0.5) * 80;
      const variant = VARIANTS[(i + Math.floor(Math.random() * VARIANTS.length)) % VARIANTS.length];
      return {
        position: [Math.sin(angle) * r, 0, -Math.cos(angle) * r] as [number, number, number],
        variant,
      };
    });
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <GroundedAsset
          key={i}
          Asset={b.variant.Asset}
          config={b.variant.config}
          position={b.position}
          extraRotationY={Math.random() * Math.PI * 2}
        />
      ))}
    </group>
  );
}
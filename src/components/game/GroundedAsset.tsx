'use client';
import { Suspense } from 'react';
import type { ComponentType } from 'react';
import type { StaticAssetConfig } from '@/config/assets.config';

interface GroundedAssetProps {
  Asset: ComponentType<any>;
  config: StaticAssetConfig;
  position: [number, number, number];
  extraRotationY?: number; // per-instance random yaw, so a whole row of the same building doesn't look copy-pasted
}

// Every static model (building, palm, prop) should render through this
// wrapper instead of being dropped into the scene directly. It's the one
// place that applies each asset's ground-angle correction, so a tilt bug
// gets fixed once per asset type, here — not scattered across placement code.
export function GroundedAsset({ Asset, config, position, extraRotationY = 0 }: GroundedAssetProps) {
  return (
    <Suspense fallback={null}>
      <group position={[position[0], position[1] + config.yOffset, position[2]]}>
        <Asset
          scale={config.scale}
          rotation={[config.rotationX, config.rotationY + extraRotationY, config.rotationZ]}
        />
      </group>
    </Suspense>
  );
}
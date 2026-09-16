'use client';
import { Model as Palm1 } from './palmtree1Asset';
import { Model as Palm2 } from './palmtree2Asset';
import { PALM_ASSET_CONFIGS } from '@/config/assets.config';
import { GroundedAsset } from './GroundedAsset';

export function PalmTreeAsset({
  position,
  variant,
}: {
  position: [number, number, number];
  variant: 1 | 2;
}) {
  const Asset = variant === 1 ? Palm1 : Palm2;
  const config = variant === 1 ? PALM_ASSET_CONFIGS.palm1 : PALM_ASSET_CONFIGS.palm2;

  return (
    <GroundedAsset
      Asset={Asset}
      config={config}
      position={position}
      extraRotationY={Math.random() * Math.PI * 2}
    />
  );
}
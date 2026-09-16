export interface StaticAssetConfig {
  scale: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  yOffset: number;
}

// One entry per .glb you add. Start every new one at all-zero rotation/offset,
// render it, then only touch the values that are visibly wrong — most static
// buildings/props need at most a rotationX fix for the up-axis issue.
export const BUILDING_ASSET_CONFIGS: Record<string, StaticAssetConfig> = {
  storey1: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
  storey10: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
  storeyGeneric: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
};

export const PALM_ASSET_CONFIGS: Record<string, StaticAssetConfig> = {
  palm1: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
  palm2: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
};
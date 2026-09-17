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

// Placeholder registration for future real obstacle/coin models. These stay at
// all-zero tuning until a .glb model is available for the game scene.
export const OBSTACLE_ASSET_CONFIGS: Record<string, StaticAssetConfig> = {
  cone: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
};

export const COIN_ASSET_CONFIGS: Record<string, StaticAssetConfig> = {
  coin: { scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, yOffset: 0 },
};
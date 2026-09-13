export const VICE_PALETTE = {
  neonPink: '#ff2fb0',
  neonTeal: '#22e6c8',
  neonPurple: '#8b2fe0',
  neonOrange: '#ff7a3d',
  buildingBase: ['#2a1f4d', '#341f5c', '#221947', '#3a2360', '#1c1440'],
  windowLit: '#ffe27a',
  windowUnlit: '#120c28',
};

export const SKY_CONFIG = {
  turbidity: 9,
  rayleigh: 2.4,
  mieCoefficient: 0.015,
  mieDirectionalG: 0.9,
  sunPosition: [-0.35, 0.06, -1] as [number, number, number],
};

export const FOG_CONFIG = {
  color: '#e8749a',
  density: 0.011,
};

export const ROAD_CONFIG = {
  width: 14,
  shoulderWidth: 2.5,
  laneMarkingColor: '#f4d35e',
  edgeLineColor: '#f5f5f5',
  asphaltColor: '#201a2e',
  shoulderColor: '#4a3a52',
  segments: 400,
};

export const PALM_CONFIG = {
  spacing: 24,
  offsetFromRoad: 11,
  jitter: 3,
  trunkHeight: [7, 11] as [number, number],
  trunkColor: '#5c4a3a',
  frondColorTop: '#2fe06a',
  frondColorBottom: '#0f8a3f',
  frondCount: 6,
  frondLength: 3.6,
  frondWidth: 1.1,
  windLean: 0.18,
};

export const BUILDING_CONFIG = {
  count: 26,
  radius: 260,
  heightRange: [24, 90] as [number, number],
  colorPalette: VICE_PALETTE.buildingBase,
  neonTrimColors: [
    VICE_PALETTE.neonPink,
    VICE_PALETTE.neonTeal,
    VICE_PALETTE.neonPurple,
    VICE_PALETTE.neonOrange,
  ],
  windowLitChance: 0.35,
};

export const GROUND_CONFIG = {
  color: '#161022',
  radius: 500,
};
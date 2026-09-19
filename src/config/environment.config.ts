export const VICE_PALETTE = {
  neonPink: '#ff2fb0',
  neonTeal: '#22e6c8',
  neonPurple: '#8b2fe0',
  neonOrange: '#ff7a3d',
  buildingBase: ['#2a1f4d', '#341f5c', '#221947', '#3a2360', '#1c1440'],
  windowLit: '#ffe27a',
  windowUnlit: '#120c28',
};

// GTA IV / Vice-City sunset: the sun sits low on the horizon, so a high
// rayleigh/turbidity pushes the sky into deep orange-pink, and the fog is a
// warm dusk haze rather than daytime blue.
export const SKY_CONFIG = {
  turbidity: 10,
  rayleigh: 2.6,
  mieCoefficient: 0.007,
  mieDirectionalG: 0.86,
  sunPosition: [-1, 0.06, -0.55] as [number, number, number],
};

export const FOG_CONFIG = {
  color: '#ffb38a', // warm peach dusk haze — brighter, happier sunset (still warm)
  density: 0.0042, // a touch thinner so the scene reads livelier, not murky
};

export const ROAD_CONFIG = {
  width: 14,
  shoulderWidth: 2.5,
  laneMarkingColor: '#f4d35e',
  edgeLineColor: '#f5f5f5',
  asphaltColor: '#2a2738',
  shoulderColor: '#413a55',
  segments: 400,
};

export const PALM_CONFIG = {
  spacing: 16,
  offsetFromRoad: 12.5, // just outside the road ribbon (half-width ≈ 9.5)
  jitter: 3.5,
  trunkHeight: [7, 11] as [number, number],
  trunkColor: '#5c4a3a',
  frondColorTop: '#2fe06a',
  frondColorBottom: '#0f8a3f',
  frondCount: 6,
  frondLength: 3.6,
  frondWidth: 1.1,
  windLean: 0.18,
};

// Buildings now line the road (placed along the track curve, well outside the
// asphalt) instead of sitting on a fixed circle the player rarely drives near.
export const BUILDING_CONFIG = {
  spacing: 16, // metres between roadside buildings (per side) — denser skyline
  offsetFromRoad: 30, // pushed back behind the palms so nothing sits on the road
  offsetJitter: 14, // outward-only depth variation, so the skyline staggers back but never onto the road
  radius: 220, // legacy (unused by roadside placement)
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
  color: '#221b33', // dark dusk terrain
  radius: 500,
};
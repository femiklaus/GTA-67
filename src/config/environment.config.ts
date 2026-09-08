export const ROAD_CONFIG = {
  width: 14,
  shoulderWidth: 2.5,        // sandy strip beyond the driving surface
  laneMarkingColor: '#f4d35e', // dashed center line
  edgeLineColor: '#f5f5f5',    // solid outer lines
  asphaltColor: '#232326',
  shoulderColor: '#6b5a44',
  segments: 400,
};

export const PALM_CONFIG = {
  spacing: 22,
  offsetFromRoad: 11,          // pushed out to clear the wider road + shoulder
  jitter: 3,
  trunkHeight: [7, 11] as [number, number],
  trunkColor: '#6b4a34',
  frondColor: '#1fbf3a',       // pure, saturated green — tune this one value to taste
  frondCount: 7,
};
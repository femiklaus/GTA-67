export const CAR_CONFIG = {
  bodyColor: '#f2ff3b',
  cabinColor: '#1c1f2f',
  wheelColor: '#111',
  tailLightColor: '#ff2b2b',
  headLightColor: '#fff6d9',
  dimensions: { length: 4.4, width: 1.9, height: 1.3 },

  baseSpeed: 26,
  maxSpeed: 38,
  steerSpeed: 7,
  maxLateral: 5.2,

  camera: {
    distanceBehind: 7,
    height: 3.2,
    lookAheadDistance: 12,
    fov: 62,
  },
    assetScale: 2.5,        // tune once you see it render — 10x up/down if invisible or giant // set to Math.PI if the car visually faces backward after the swap
assetRotationY: -Math.PI / 2,   // was 0 — this is the clockwise 90° turn (viewed from above)

assetRotationX: -Math.PI / 2,  // most common fix for a Z-up export landing in a Y-up scene
  assetRotationZ: 0,
  assetYOffset: 0,    

   centeringAssist: 1.4,




};

  
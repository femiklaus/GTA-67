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
    assetScale: 1.8,          // tuned by eye against the road width
  assetRotationY: -Math.PI / 2,  // GLB length runs along X; yaw 90° so it points down the road (-Z)
  assetRotationX: 0,        // model is already Y-up — no up-axis fix needed
  assetRotationZ: 0,
  assetYOffset: 0,

   centeringAssist: 1.4,




};

  
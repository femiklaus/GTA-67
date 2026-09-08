export const CAR_CONFIG = {
  bodyColor: '#15181f',
  cabinColor: '#0c0d10',
  wheelColor: '#111',
  tailLightColor: '#ff2b2b',
  headLightColor: '#fff6d9',
  dimensions: { length: 4.4, width: 1.9, height: 1.3 },

  baseSpeed: 26,        // units/sec forward along the track
  steerSpeed: 6,         // lateral units/sec when steering
  maxLateral: 4.5,        // clamp so you can't leave the road

  camera: {
    distanceBehind: 7,
    height: 3.2,
    lookAheadDistance: 12,
    fov: 62,
  },
};
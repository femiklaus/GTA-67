export const GAMEPLAY_CONFIG = {
  // Two lanes, mirrored around the centre line. Obstacles only ever block ONE
  // lane per row, so there is always a clear lane to weave into — every
  // obstacle is avoidable with good timing.
  laneX: 3.4,

  // Distance (world units) over which difficulty ramps from 0 → 1. The build-up
  // is gradual and continuous, not sudden: the opening stretch is calm and the
  // road only tightens the further you drive.
  difficultyDistance: 7000,

  // Obstacles ---------------------------------------------------------------
  obstacleSafeStart: 130,     // calm, obstacle-free runway at the very start
  obstacleSpacingEasy: 95,    // wide gaps early — open and readable
  obstacleSpacingHard: 40,    // tighter, more frequent gaps deep into the run
  obstacleSwitchChanceEasy: 0.35, // how often a row forces a lane change (easy)
  obstacleSwitchChanceHard: 0.8,  // …and hard — more weaving later

  // Coins -------------------------------------------------------------------
  coinStart: 45,
  coinSpacingEasy: 13,        // dense early (common)
  coinSpacingHard: 42,        // rarer later (never fully gone)
  coinValue: 10,              // base value; grows with difficulty

  // Collision / pickup tolerances ------------------------------------------
  collisionZ: 1.9,
  collisionX: 1.7,
  coinGrabZ: 1.6,
  coinGrabX: 1.5,

  // Streaming window --------------------------------------------------------
  spawnAhead: 240,            // spawn this far ahead (fades in through the fog)
  recycleBehind: 32,          // recycle once this far behind the car

  // Car physics (unchanged) -------------------------------------------------
  brakeDecel: 22,
  accel: 10,
  minSpeedFactor: 0.3,
};

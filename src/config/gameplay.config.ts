export const GAMEPLAY_CONFIG = {
  obstacleSpacing: 60,
  obstacleLanes: [-3, 0, 3],
  coinSpacing: 16,
  coinLanes: [-4, -1.3, 1.3, 4],
  collisionRadius: 1.7,
  coinRadius: 1.4,
  coinValue: 10,

  brakeDecel: 22,       // speed lost per second while braking
  accel: 10,            // speed regained per second when not braking
  minSpeedFactor: 0.3,  // fraction of baseSpeed when fully braked
};
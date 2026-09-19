// A tiny mutable singleton the DrivingRig writes every frame and the endless
// world fields (obstacles, coins, roadside decor) read every frame. Using a
// plain object — not React state — keeps the streaming/recycling loop free of
// re-renders while still letting every field stay in lock-step with the car.
//
//   dist       — how far (world units) the car has travelled down the straight.
//   lateral    — the car's current lane offset (world X).
//   difficulty — 0 (start) → 1 (fully ramped), a function of distance.
//   obstacles  — the currently-active obstacle rows, so the coin field can
//                avoid dropping a coin exactly where it would force a crash.
export const driveState: {
  dist: number;
  lateral: number;
  difficulty: number;
  obstacles: { dist: number; lane: number }[];
} = {
  dist: 0,
  lateral: 0,
  difficulty: 0,
  obstacles: [],
};

export function resetDriveState(startDist: number) {
  driveState.dist = startDist;
  driveState.lateral = 0;
  driveState.difficulty = 0;
  driveState.obstacles = [];
}

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
//   carHalfWidth  — the car model's real rendered half-extent across X (lanes).
//   carHalfLength — the car model's real rendered half-extent along Z (travel).
//                   Both are measured once from the actual car mesh's bounding
//                   box (see CarModel) so collision matches the VISIBLE car, not
//                   a guessed config size. Sensible fallbacks until measured.
export const driveState: {
  dist: number;
  lateral: number;
  difficulty: number;
  obstacles: { dist: number; lane: number }[];
  carHalfWidth: number;
  carHalfLength: number;
  carHalfHeight: number;
} = {
  dist: 0,
  lateral: 0,
  difficulty: 0,
  obstacles: [],
  carHalfWidth: 0.95,
  carHalfLength: 2.2,
  carHalfHeight: 0.65,
};

export function resetDriveState(startDist: number) {
  driveState.dist = startDist;
  driveState.lateral = 0;
  driveState.difficulty = 0;
  driveState.obstacles = [];
}

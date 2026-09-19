// The road is a SINGLE, LONG, PERFECTLY STRAIGHT stretch — no curves, no
// bends, no cross-roads, no intersections, ever. `curve` is kept in the type
// only so existing helpers compile; every segment here is 0 (straight).
//
// The straight is made very long so the car can drive for well over an hour
// before it could ever reach the far end (which lives far beyond the fog and
// is never seen). Endlessness/variation is delivered by streaming and
// recycling the obstacles, coins and roadside scenery around the car, not by
// bending the road back on itself.
export interface TrackSegment {
  length: number;
  curve: number;
}

export const TRACK: TrackSegment[] = [
  { length: 120000, curve: 0 }, // one long, uninterrupted straight
];

// Straight road needs no fine sampling — a coarse step keeps the curve light.
export const TRACK_SAMPLE_STEP = 400;

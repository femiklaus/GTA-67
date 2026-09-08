// curve > 0 bends right, < 0 bends left, 0 = straight.
// Tune this to recreate the coastal-highway sweep in your reference video.
export interface TrackSegment {
  length: number;
  curve: number;
}

export const TRACK: TrackSegment[] = [
  { length: 220, curve: 0 },
  { length: 260, curve: 0.55 },
  { length: 180, curve: 0 },
  { length: 240, curve: -0.5 },
  { length: 200, curve: 0 },
  { length: 200, curve: 0.35 },
  { length: 260, curve: 0 },
  { length: 220, curve: -0.35 },
];

export const TRACK_SAMPLE_STEP = 10; // smaller = smoother curve, slower to build
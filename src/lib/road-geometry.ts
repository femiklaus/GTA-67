import * as THREE from 'three';
import { TRACK, TRACK_SAMPLE_STEP } from './track';

// Walks the TRACK segments and returns an OPEN (non-closed) straight 3D curve
// running down -Z. Because every segment is straight, the curve is a plain
// line; it is not looped back on itself (a straight road cannot close), so the
// car simply drives forward down it.
export function buildTrackCurve(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  let x = 0, z = 0, heading = 0;

  // Start exactly at the origin so a point's arc-length distance equals its
  // world -Z. The endless world fields place decor/obstacles/coins at raw
  // z = -dist, so the curve MUST begin at (0,0,0) for the car (placed via this
  // curve) and those fields to share one coordinate system.
  points.push(new THREE.Vector3(0, 0, 0));

  TRACK.forEach((seg) => {
    const steps = Math.ceil(seg.length / TRACK_SAMPLE_STEP);
    const turnPerStep = (seg.curve * TRACK_SAMPLE_STEP) / 52;
    for (let i = 0; i < steps; i++) {
      heading += turnPerStep;
      x += Math.sin(heading) * TRACK_SAMPLE_STEP;
      z -= Math.cos(heading) * TRACK_SAMPLE_STEP;
      points.push(new THREE.Vector3(x, 0, z));
    }
  });

  // `false` = open curve (no wrap-around). Straight road, one direction.
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
}

// Distance (world units) covered by one repeat of the road texture — governs
// how far apart the dashed centre-line markings sit.
const ROAD_TEXTURE_PERIOD = 30;

// Builds a flat ribbon mesh geometry following the curve — this is the road surface.
export function buildRoadGeometry(
  curve: THREE.CatmullRomCurve3,
  width: number,
  segments: number,
  length?: number
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const totalLength = length ?? curve.getLength();

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const left = p.clone().addScaledVector(side, width / 2);
    const right = p.clone().addScaledVector(side, -width / 2);

    positions.push(left.x, 0.01, left.z, right.x, 0.01, right.z);
    // Tile the lane markings by real world distance so the dashes keep a
    // constant spacing no matter how long the straight is.
    const v = (t * totalLength) / ROAD_TEXTURE_PERIOD;
    uvs.push(0, v, 1, v);

    if (i < segments) {
      const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Helper other components use to place things (palms, buildings) relative to the road.
export function getPointAndSide(curve: THREE.CatmullRomCurve3, t: number) {
  // Open (straight) road: clamp to [0,1] rather than wrapping — there is no
  // loop to wrap around to.
  const tt = Math.min(Math.max(t, 0), 1);
  const point = curve.getPointAt(tt);
  const tangent = curve.getTangentAt(tt);
  const side = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
  return { point, tangent, side };
}
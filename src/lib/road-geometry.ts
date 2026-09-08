import * as THREE from 'three';
import { TRACK, TRACK_SAMPLE_STEP } from './track';

// Walks the hand-authored TRACK segments and returns a closed-loop 3D curve.
export function buildTrackCurve(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  let x = 0, z = 0, heading = 0;

  TRACK.forEach((seg) => {
    const steps = Math.ceil(seg.length / TRACK_SAMPLE_STEP);
    const turnPerStep = (seg.curve * TRACK_SAMPLE_STEP) / 60; // tune divisor to change turn sharpness
    for (let i = 0; i < steps; i++) {
      heading += turnPerStep;
      x += Math.sin(heading) * TRACK_SAMPLE_STEP;
      z -= Math.cos(heading) * TRACK_SAMPLE_STEP;
      points.push(new THREE.Vector3(x, 0, z));
    }
  });

  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.1);
}

// Builds a flat ribbon mesh geometry following the curve — this is the road surface.
export function buildRoadGeometry(curve: THREE.CatmullRomCurve3, width: number, segments: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const left = p.clone().addScaledVector(side, width / 2);
    const right = p.clone().addScaledVector(side, -width / 2);

    positions.push(left.x, 0.01, left.z, right.x, 0.01, right.z);
    const v = t * segments * 0.15; // controls lane-marking texture tiling
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
  const point = curve.getPointAt(t % 1);
  const tangent = curve.getTangentAt(t % 1);
  const side = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
  return { point, tangent, side };
}
'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { driveState } from '@/lib/drive-state';

/*
  Car accents that ride with the car (mounted inside the driving rig's carGroup,
  so they inherit its position + yaw automatically):

    1. Contact shadow — a cheap soft radial-gradient blob on the road under the
       car. Real shadow-mapping is off for performance; this keeps the car from
       looking like it floats, at a cost of one draw call.

  The shadow is sized/placed every frame from the car's REAL measured bounds
  (published by CarModel into driveState), so it fits the actual model.
*/

// One small radial-gradient texture → a soft-edged shadow with no hard rim.
function useSoftBlobTexture() {
  return useMemo(() => {
    const s = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.32)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);
}

export function CarAccents() {
  const shadow = useRef<THREE.Mesh>(null);
  const tex = useSoftBlobTexture();

  useFrame(() => {
    const hw = driveState.carHalfWidth || 0.95;
    const hl = driveState.carHalfLength || 2.2;
    if (shadow.current) shadow.current.scale.set(hw * 2.6, hl * 2.15, 1);
  });

  return (
    <>
      {/* Soft contact shadow on the road. */}
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
    </>
  );
}

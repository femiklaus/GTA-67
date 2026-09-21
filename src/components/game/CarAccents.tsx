'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { driveState } from '@/lib/drive-state';

/*
  Car accents that ride with the car (mounted inside the driving rig's carGroup,
  so they inherit its position + yaw automatically):

    1. Backlight — glowing red tail-lights on the REAR face of the car (the face
       the chase camera looks at), so the car reads as lit from behind.
    2. Contact shadow — a cheap soft radial-gradient blob on the road under the
       car. Real shadow-mapping is off for performance; this keeps the car from
       looking like it floats, at a cost of one draw call.

  Everything is sized/placed every frame from the car's REAL measured bounds
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
  const glowL = useRef<THREE.Mesh>(null);
  const glowR = useRef<THREE.Mesh>(null);
  const bar = useRef<THREE.Mesh>(null);
  const tex = useSoftBlobTexture();

  useFrame(() => {
    const hw = driveState.carHalfWidth || 0.95;
    const hl = driveState.carHalfLength || 2.2;
    const fh = (driveState.carHalfHeight || 0.65) * 2;

    const ly = fh * 0.52; // tail-light height up the rear
    const lz = hl * 0.98; // rear face (car faces -Z, so +Z is the back)
    const lx = hw * 0.62; // lateral offset toward each rear corner

    if (shadow.current) shadow.current.scale.set(hw * 2.6, hl * 2.15, 1);
    if (glowL.current) glowL.current.position.set(-lx, ly, lz);
    if (glowR.current) glowR.current.position.set(lx, ly, lz);
    if (bar.current) bar.current.position.set(0, ly, lz - 0.02);
  });

  return (
    <>
      {/* Soft contact shadow on the road. */}
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>

      {/* Backlight: a dim connecting strip + two bright red tail-lights. */}
      <mesh ref={bar}>
        <boxGeometry args={[1.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#5a0a00" emissive="#ff2200" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={glowL}>
        <boxGeometry args={[0.5, 0.2, 0.09]} />
        <meshStandardMaterial color="#ff2a00" emissive="#ff2a00" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <mesh ref={glowR}>
        <boxGeometry args={[0.5, 0.2, 0.09]} />
        <meshStandardMaterial color="#ff2a00" emissive="#ff2a00" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
    </>
  );
}

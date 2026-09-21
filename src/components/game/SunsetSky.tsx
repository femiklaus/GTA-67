'use client';
import { FOG_CONFIG, GROUND_CONFIG } from '@/config/environment.config';

/*
  Bright daytime sky.

  A flat, bright sky-blue background (#9ddbfc) with fog set to the exact same
  blue, so the road and roadside decor fade seamlessly into the horizon with no
  hard seam. Lit by a high neutral sun (plus a soft cool fill) so the whole
  scene reads as a clear day rather than a dusk/sunset.
*/

const DAY_SKY = '#9ddbfc';

export function SunsetSky() {
  return (
    <>
      {/* Solid bright-blue day sky. */}
      <color attach="background" args={[DAY_SKY]} />
      {/* Fog matches the sky exactly so distance melts into the horizon. */}
      <fogExp2 attach="fog" args={[DAY_SKY, FOG_CONFIG.density]} />

      {/* Daytime lighting: bright sky-tinted fill + a high neutral sun. */}
      <ambientLight intensity={0.95} color="#eaf6ff" />
      <hemisphereLight args={['#cdeeff', '#2a2340', 0.85]} />
      <directionalLight position={[-50, 60, -30]} intensity={2.0} color="#fff4e0" />
      {/* Soft cool fill from the opposite side to keep shadows from going flat. */}
      <directionalLight position={[50, 40, 30]} intensity={0.45} color="#bfe4ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[GROUND_CONFIG.radius, 64]} />
        <meshStandardMaterial color={GROUND_CONFIG.color} />
      </mesh>
    </>
  );
}

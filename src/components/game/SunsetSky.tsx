'use client';
import { Sky } from '@react-three/drei';
import { SKY_CONFIG, FOG_CONFIG, GROUND_CONFIG } from '@/config/environment.config';

export function SunsetSky() {
  return (
    <>
      <Sky
        turbidity={SKY_CONFIG.turbidity}
        rayleigh={SKY_CONFIG.rayleigh}
        mieCoefficient={SKY_CONFIG.mieCoefficient}
        mieDirectionalG={SKY_CONFIG.mieDirectionalG}
        sunPosition={SKY_CONFIG.sunPosition}
      />
      <fogExp2 attach="fog" args={[FOG_CONFIG.color, FOG_CONFIG.density]} />
      {/* warm dusk ambience: soft pink fill + a low orange "sunset" key light.
          Lifted a little for a brighter, happier sunset without blowing it out. */}
      <ambientLight intensity={0.9} color="#ffe3cc" />
      <hemisphereLight args={['#ffc7a0', '#3a2a52', 0.8]} />
      <directionalLight
        position={[-60, 22, -40]}
        intensity={2.1}
        color="#ff8a4a"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* cool rim light from the opposite side for that neon-city separation */}
      <directionalLight position={[50, 30, 30]} intensity={0.5} color="#7ad6ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[GROUND_CONFIG.radius, 64]} />
        <meshStandardMaterial color={GROUND_CONFIG.color} />
      </mesh>
    </>
  );
}
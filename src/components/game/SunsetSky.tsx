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
      <ambientLight intensity={0.6} color="#ffd7a8" />
      <directionalLight position={[-40, 20, -40]} intensity={1.4} color="#ffb877" castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[GROUND_CONFIG.radius, 64]} />
        <meshStandardMaterial color={GROUND_CONFIG.color} />
      </mesh>
    </>
  );
}
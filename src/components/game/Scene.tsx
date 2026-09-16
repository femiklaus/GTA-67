'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildTrackCurve, getPointAndSide } from '@/lib/road-geometry';
import { useGameStore } from '@/lib/store';
import { useGameplayObjects } from '@/lib/use-gameplay-objects';
import { KeyboardControls } from './KeyboardControls';
import { Road } from './Road';
import { BuildingsAsset } from './BuildingsAsset';
import { SunsetSky } from './SunsetSky';
import { CarModel } from './CarModel';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { PALM_CONFIG, ROAD_CONFIG } from '@/config/environment.config';
import { CAR_CONFIG } from '@/config/car.config';
import { GAMEPLAY_CONFIG } from '@/config/gameplay.config';
import { PalmTreeAsset } from './PalmTreeAsset';


function DrivingRig({
  curve,
  checkCollisions,
}: {
  curve: THREE.CatmullRomCurve3;
  checkCollisions: (carPos: THREE.Vector3) => void;
}) {
  const carGroup = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const lateral = useRef(0);
  const speed = useRef(0);
  const steer = useRef(0);
  const curveLength = useMemo(() => curve.getLength(), [curve]);

  useFrame((state, delta) => {
    const { left, right, accelerate, brake } = useGameStore.getState().controls;
    const { crashed } = useGameStore.getState();

    if (crashed) return;

    const throttle = accelerate ? 1 : 0;
    const braking = brake ? 1 : 0;

    if (throttle && !braking) {
      speed.current = Math.min(CAR_CONFIG.maxSpeed, speed.current + GAMEPLAY_CONFIG.accel * delta * 1.8);
    } else if (braking) {
      if (speed.current > 0.2) {
        speed.current = Math.max(0, speed.current - GAMEPLAY_CONFIG.brakeDecel * delta);
      } else {
        speed.current = Math.max(-12, speed.current - 18 * delta);
      }
    } else {
      speed.current *= 1 - Math.min(1, 1.4 * delta);
      if (Math.abs(speed.current) < 0.03) speed.current = 0;
    }

    const steerInput = (right ? 1 : 0) - (left ? 1 : 0);
    const steeringPower = THREE.MathUtils.clamp(1.9 - Math.min(Math.abs(speed.current) / CAR_CONFIG.maxSpeed, 1) * 1.1, 0.85, 1.9);
    steer.current = THREE.MathUtils.lerp(steer.current, steerInput, 8 * delta);
    lateral.current += steer.current * CAR_CONFIG.steerSpeed * steeringPower * delta * 0.9;

    const roadMaxLateral = ROAD_CONFIG.width * 0.5 - CAR_CONFIG.dimensions.width * 0.7;
    const edgeBuffer = 1.6;
    const edgeDistance = roadMaxLateral - Math.abs(lateral.current);

    if (edgeDistance < edgeBuffer && edgeDistance > 0) {
      speed.current *= 1 - (1 - edgeDistance / edgeBuffer) * 0.6 * delta * 5;
    }

    if (Math.abs(lateral.current) > roadMaxLateral) {
      const dir = lateral.current >= 0 ? 1 : -1;
      lateral.current = dir * roadMaxLateral;
    }

    progress.current += (speed.current * delta) / curveLength;
    if (progress.current > 1) progress.current -= 1;
    if (progress.current < 0) progress.current += 1;

    const { point, tangent, side } = getPointAndSide(curve, progress.current);
    const carPos = point.clone().addScaledVector(side, lateral.current);
    const heading = Math.atan2(tangent.x, -tangent.z);

    if (carGroup.current) {
      carGroup.current.position.copy(carPos);
      carGroup.current.rotation.set(0, heading, -lateral.current * 0.04);
    }

    checkCollisions(carPos);

    const behindT = ((progress.current - CAR_CONFIG.camera.distanceBehind / curveLength) + 1) % 1;
    const camPoint = curve.getPointAt(behindT).clone().addScaledVector(side, lateral.current);
    camPoint.y += CAR_CONFIG.camera.height;
    state.camera.position.lerp(camPoint, 1 - Math.exp(-delta * 4));

    const aheadT = (progress.current + CAR_CONFIG.camera.lookAheadDistance / curveLength) % 1;
    const lookPoint = curve.getPointAt(aheadT);
    state.camera.lookAt(lookPoint.x, 1.25, lookPoint.z);
  });

  return (
    <group ref={carGroup}>
      <CarModel />
    </group>
  );
}

function Palms({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const trees = useMemo(() => {
    const curveLength = curve.getLength();
    const count = Math.floor(curveLength / PALM_CONFIG.spacing);
    const list: { position: [number, number, number]; variant: 1 | 2 }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const { point, side } = getPointAndSide(curve, t);
      for (const dir of [-1, 1]) {
        const jitter = (Math.random() - 0.5) * PALM_CONFIG.jitter;
        const pos = point.clone().addScaledVector(side, dir * (PALM_CONFIG.offsetFromRoad + jitter));
        list.push({ position: [pos.x, 0, pos.z], variant: Math.random() < 0.5 ? 1 : 2 });
      }
    }
    return list;
  }, [curve]);

  return (
    <group>
      {trees.map((t, i) => (
        <PalmTreeAsset key={i} position={t.position} variant={t.variant} />
      ))}
    </group>
  );
}

export function Scene() {
  const curve = useMemo(() => buildTrackCurve(), []);
  const { obstacles, coins, collected, checkCollisions } = useGameplayObjects(curve);

  return (
    <>
      <KeyboardControls />
      <Canvas shadows camera={{ fov: CAR_CONFIG.camera.fov, near: 0.1, far: 1000 }}>
        <SunsetSky />
        <Road curve={curve} />
        <Palms curve={curve} />
        <BuildingsAsset />
        <Obstacles items={obstacles} />
        <Coins items={coins} collected={collected} />
        <DrivingRig curve={curve} checkCollisions={checkCollisions} />
      </Canvas>
    </>
  );
}
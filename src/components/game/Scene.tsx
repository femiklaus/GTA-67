'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildTrackCurve, getPointAndSide } from '@/lib/road-geometry';
import { useGameStore } from '@/lib/store';
import { useGameplayObjects } from '@/lib/use-gameplay-objects';
import { KeyboardControls } from './KeyboardControls';
import { Road } from './Road';
import { PalmTree } from './PalmTree';
import { Buildings } from './Buildings';
import { SunsetSky } from './SunsetSky';
import { CarModel } from './CarModel';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { PALM_CONFIG } from '@/config/environment.config';
import { CAR_CONFIG } from '@/config/car.config';
import { GAMEPLAY_CONFIG } from '@/config/gameplay.config';

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
  const currentSpeed = useRef(CAR_CONFIG.baseSpeed);
  const curveLength = useMemo(() => curve.getLength(), [curve]);

  useFrame((state, delta) => {
    const { left, right, brake } = useGameStore.getState().controls;
    const { crashed } = useGameStore.getState();

    if (crashed) return; // frozen until the player hits Retry

    if (brake) {
      currentSpeed.current = Math.max(
        CAR_CONFIG.baseSpeed * GAMEPLAY_CONFIG.minSpeedFactor,
        currentSpeed.current - GAMEPLAY_CONFIG.brakeDecel * delta
      );
    } else {
      currentSpeed.current = Math.min(
        CAR_CONFIG.baseSpeed,
        currentSpeed.current + GAMEPLAY_CONFIG.accel * delta
      );
    }

    progress.current += (currentSpeed.current * delta) / curveLength;
    if (progress.current > 1) progress.current -= 1;

    if (left) lateral.current -= CAR_CONFIG.steerSpeed * delta;
    if (right) lateral.current += CAR_CONFIG.steerSpeed * delta;
    lateral.current = THREE.MathUtils.clamp(lateral.current, -CAR_CONFIG.maxLateral, CAR_CONFIG.maxLateral);

    const { point, tangent, side } = getPointAndSide(curve, progress.current);
    const carPos = point.clone().addScaledVector(side, lateral.current);
    const heading = Math.atan2(tangent.x, tangent.z);

    if (carGroup.current) {
      carGroup.current.position.copy(carPos);
      carGroup.current.rotation.set(0, heading, -lateral.current * 0.05);
    }

    checkCollisions(carPos);

    const behindT = ((progress.current - CAR_CONFIG.camera.distanceBehind / curveLength) + 1) % 1;
    const camPoint = curve.getPointAt(behindT).clone().addScaledVector(side, lateral.current);
    camPoint.y += CAR_CONFIG.camera.height;
    state.camera.position.lerp(camPoint, 0.15);

    const aheadT = (progress.current + CAR_CONFIG.camera.lookAheadDistance / curveLength) % 1;
    const lookPoint = curve.getPointAt(aheadT);
    state.camera.lookAt(lookPoint.x, 1, lookPoint.z);
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
    const list: { position: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const { point, side } = getPointAndSide(curve, t);
      for (const dir of [-1, 1]) {
        const jitter = (Math.random() - 0.5) * PALM_CONFIG.jitter;
        const pos = point.clone().addScaledVector(side, dir * (PALM_CONFIG.offsetFromRoad + jitter));
        list.push({ position: [pos.x, 0, pos.z], scale: 0.8 + Math.random() * 0.5 });
      }
    }
    return list;
  }, [curve]);

  return (
    <group>
      {trees.map((t, i) => (
        <PalmTree key={i} position={t.position} scale={t.scale} />
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
        <Buildings />
        <Obstacles items={obstacles} />
        <Coins items={coins} collected={collected} />
        <DrivingRig curve={curve} checkCollisions={checkCollisions} />
      </Canvas>
    </>
  );
}
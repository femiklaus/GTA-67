'use client';
import { useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildTrackCurve, getPointAndSide } from '@/lib/road-geometry';
import { useGameStore } from '@/lib/store';
import { driveState, resetDriveState } from '@/lib/drive-state';
import { KeyboardControls } from './KeyboardControls';
import { GamepadControls } from './GamepadControls';
import { Road } from './Road';
import { SunsetSky } from './SunsetSky';
import { CarModel } from './CarModel';
import { DecorPalms, DecorBuildings, ObstacleField, CoinField } from './WorldFields';
import { ROAD_CONFIG } from '@/config/environment.config';
import { CAR_CONFIG } from '@/config/car.config';
import { GAMEPLAY_CONFIG } from '@/config/gameplay.config';

function DrivingRig({ curve, runId }: { curve: THREE.CatmullRomCurve3; runId: number }) {
  const carGroup = useRef<THREE.Group>(null);
  const curveLength = useMemo(() => curve.getLength(), [curve]);

  // Start a hair down the road so there is always room for the camera to sit
  // behind the car (the straight begins at z=0).
  const startProgress = CAR_CONFIG.camera.distanceBehind / curveLength;

  const progress = useRef(startProgress);
  const lateral = useRef(0);
  const speed = useRef(0);
  const steer = useRef(0);
  const autoElapsed = useRef(0);

  // On retry/reset the store bumps runId — rewind the car to the start line so
  // no position/speed/steer survives the previous run.
  useEffect(() => {
    progress.current = startProgress;
    lateral.current = 0;
    speed.current = 0;
    steer.current = 0;
    autoElapsed.current = 0;
    resetDriveState(startProgress * curveLength);
  }, [runId, startProgress, curveLength]);

  // The most the car body visibly angles when steering — a single-digit degree
  // lean into the lane change, back always to the camera.
  const STEER_YAW = THREE.MathUtils.degToRad(8);
  const AUTO_DRIVE_SECONDS = 3.5;

  useFrame((state, delta) => {
    const { controls, crashed, paused } = useGameStore.getState();
    const { left, right, accelerate, brake } = controls;

    // Frozen while crashed OR paused — nothing (car, camera, world) advances,
    // and the score is untouched, so unpausing resumes exactly where we were.
    if (crashed || paused) return;

    autoElapsed.current += delta;
    const autoDrive = autoElapsed.current < AUTO_DRIVE_SECONDS;

    const throttle = accelerate || autoDrive ? 1 : 0;
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
      speed.current *= 1 - Math.min(1, 0.55 * delta);
      if (Math.abs(speed.current) < 0.03) speed.current = 0;
    }

    // Steering — holds its lane offset, only moves while the car is moving.
    const steerInput = (right ? 1 : 0) - (left ? 1 : 0);
    const steeringPower = THREE.MathUtils.clamp(
      1.9 - Math.min(Math.abs(speed.current) / CAR_CONFIG.maxSpeed, 1) * 1.1,
      0.85,
      1.9
    );
    steer.current = THREE.MathUtils.lerp(steer.current, steerInput, 8 * delta);
    const MOVING_THRESHOLD = 0.5;
    if (Math.abs(speed.current) > MOVING_THRESHOLD) {
      const speedInfluence = Math.min(1, Math.abs(speed.current) / 4);
      lateral.current +=
        steer.current * CAR_CONFIG.steerSpeed * steeringPower * delta * 0.9 * speedInfluence;
    }

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

    // Advance along the straight. Clamp (never wrap) — the road is open, and it
    // is long enough that the far end is unreachable in a real session.
    progress.current += (speed.current * delta) / curveLength;
    progress.current = Math.min(1, Math.max(0, progress.current));

    const { point, tangent, side } = getPointAndSide(curve, progress.current);
    const carPos = point.clone().addScaledVector(side, lateral.current);
    const heading = Math.atan2(tangent.x, -tangent.z);

    if (carGroup.current) {
      carGroup.current.position.copy(carPos);
      // Face forward, plus a small speed-scaled steering lean. Sign is set so a
      // move to the LEFT lane tilts the car's front LEFT and a move RIGHT tilts
      // it RIGHT (natural lean into the lane change).
      const leanFactor = Math.min(1, Math.abs(speed.current) / 3);
      carGroup.current.rotation.set(0, heading - steer.current * STEER_YAW * leanFactor, 0);
    }

    // Publish the car's world position for the endless world fields.
    driveState.dist = progress.current * curveLength;
    driveState.lateral = lateral.current;
    driveState.difficulty = Math.min(1, driveState.dist / GAMEPLAY_CONFIG.difficultyDistance);

    // --- CAMERA (unchanged framing) --------------------------------------
    // Same behind-distance, height, look-ahead and fov as before; only the
    // parametric look-ups are clamped (not wrapped) so the exact same angle
    // works on an open straight road.
    const behindT = Math.max(progress.current - CAR_CONFIG.camera.distanceBehind / curveLength, 0);
    const behind = getPointAndSide(curve, behindT);
    const camPoint = behind.point.clone().addScaledVector(behind.side, lateral.current);
    camPoint.y += CAR_CONFIG.camera.height;
    state.camera.position.lerp(camPoint, 1 - Math.exp(-delta * 4));

    const aheadT = Math.min(progress.current + CAR_CONFIG.camera.lookAheadDistance / curveLength, 1);
    const ahead = getPointAndSide(curve, aheadT);
    const lookPoint = ahead.point.clone().addScaledVector(ahead.side, lateral.current);
    state.camera.lookAt(lookPoint.x, 1.25, lookPoint.z);
  });

  return (
    <group ref={carGroup}>
      <CarModel />
    </group>
  );
}

export function Scene() {
  const curve = useMemo(() => buildTrackCurve(), []);
  const runId = useGameStore((s) => s.runId);

  return (
    <>
      <KeyboardControls />
      <GamepadControls />
      <Canvas shadows camera={{ fov: CAR_CONFIG.camera.fov, near: 0.1, far: 1000 }}>
        <Suspense fallback={null}>
          <SunsetSky />
          <Road curve={curve} />
          <DecorPalms />
          <DecorBuildings />
          <ObstacleField />
          <CoinField />
          <DrivingRig curve={curve} runId={runId} />
        </Suspense>
      </Canvas>
    </>
  );
}

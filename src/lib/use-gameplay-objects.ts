import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getPointAndSide } from './road-geometry';
import { GAMEPLAY_CONFIG } from '@/config/gameplay.config';
import { useGameStore } from './store';

export interface WorldItem {
  position: THREE.Vector3;
}

function placeAlongTrack(
  curve: THREE.CatmullRomCurve3,
  spacing: number,
  lanes: number[]
): WorldItem[] {
  const length = curve.getLength();
  const count = Math.floor(length / spacing);
  const items: WorldItem[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const { point, side } = getPointAndSide(curve, t);
    const lane = lanes[i % lanes.length];
    items.push({ position: point.clone().addScaledVector(side, lane) });
  }
  return items;
}

export function useGameplayObjects(curve: THREE.CatmullRomCurve3) {
  const obstacles = useMemo(
    () => placeAlongTrack(curve, GAMEPLAY_CONFIG.obstacleSpacing, GAMEPLAY_CONFIG.obstacleLanes),
    [curve]
  );
  const coins = useMemo(
    () => placeAlongTrack(curve, GAMEPLAY_CONFIG.coinSpacing, GAMEPLAY_CONFIG.coinLanes),
    [curve]
  );

  const [collected, setCollected] = useState<boolean[]>(() => coins.map(() => false));
  const collectedRef = useRef(collected);
  collectedRef.current = collected;

  // Call every frame from the driving loop with the car's current world position.
  const checkCollisions = (carPos: THREE.Vector3) => {
    const { crashed } = useGameStore.getState();
    if (!crashed) {
      for (const obs of obstacles) {
        if (carPos.distanceTo(obs.position) < GAMEPLAY_CONFIG.collisionRadius) {
          useGameStore.getState().crash();
          break;
        }
      }
    }

    let changed = false;
    const next = collectedRef.current.slice();
    coins.forEach((coin, i) => {
      if (next[i]) return;
      if (carPos.distanceTo(coin.position) < GAMEPLAY_CONFIG.coinRadius) {
        next[i] = true;
        changed = true;
        useGameStore.getState().addScore(GAMEPLAY_CONFIG.coinValue);
      }
    });
    if (changed) setCollected(next);
  };

  return { obstacles, coins, collected, checkCollisions };
}
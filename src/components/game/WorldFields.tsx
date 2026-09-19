'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useGameStore } from '@/lib/store';
import { driveState } from '@/lib/drive-state';
import { GAMEPLAY_CONFIG as G } from '@/config/gameplay.config';
import { PALM_CONFIG, BUILDING_CONFIG } from '@/config/environment.config';
import { PalmTreeAsset } from './PalmTreeAsset';
import { GroundedAsset, type ColorMode } from './GroundedAsset';
import { Model as Storey1 } from './1storeyAsset';
import { Model as Storey10 } from './10storeyAsset';
import { Model as StoreyGeneric } from './storeyAsset';
import { BUILDING_ASSET_CONFIGS } from '@/config/assets.config';

const lerp = THREE.MathUtils.lerp;

/* -------------------------------------------------------------------------- */
/*  Roadside decoration — palms & buildings that stream by and recycle.        */
/*                                                                            */
/*  Each instance owns a forward distance `dist`. Every frame we read how far  */
/*  the car has travelled; any instance that has fallen behind the car is      */
/*  jumped forward by a whole pass-length (a multiple of its spacing) so it     */
/*  re-appears far ahead in the fog with the pattern perfectly preserved — no  */
/*  seam, no pop, no gap.                                                       */
/* -------------------------------------------------------------------------- */

type DecorSlot = {
  dist: number;
  side: 1 | -1;
  jitter: number;
};

function useDecorSlots(count: number, spacing: number, jitterRange: number) {
  return useMemo<DecorSlot[]>(() => {
    const slots: DecorSlot[] = [];
    for (let i = 0; i < count; i++) {
      const pair = Math.floor(i / 2);
      slots.push({
        // start a little behind the camera and march forward
        dist: -G.recycleBehind + pair * spacing,
        side: i % 2 === 0 ? -1 : 1,
        jitter: Math.random() * jitterRange,
      });
    }
    return slots;
  }, [count, spacing, jitterRange]);
}

export function DecorPalms() {
  const COUNT = 46; // 23 per side ≈ a 360-unit rolling window each side
  const spacing = PALM_CONFIG.spacing;
  const span = Math.ceil(COUNT / 2) * spacing; // one full pass length per side
  const slots = useDecorSlots(COUNT, spacing, PALM_CONFIG.jitter);
  const groups = useRef<(THREE.Group | null)[]>([]);

  // Fixed per-instance look (variant + colour) so recycling never remounts —
  // the pool itself is pre-mixed, which keeps the roadside varied.
  const looks = useMemo(
    () =>
      slots.map(() => {
        const r = Math.random();
        const colorMode: ColorMode =
          r < 0.5 ? 'lightGreen' : r < 0.7 ? 'greenGradient' : r < 0.85 ? 'darkGreen' : 'original';
        return { variant: (Math.random() < 0.5 ? 1 : 2) as 1 | 2, colorMode };
      }),
    [slots]
  );

  useFrame(() => {
    const cd = driveState.dist;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      while (s.dist < cd - G.recycleBehind) s.dist += span;
      const g = groups.current[i];
      if (g) g.position.set(s.side * (PALM_CONFIG.offsetFromRoad + s.jitter), 0, -s.dist);
    }
  });

  return (
    <>
      {slots.map((s, i) => (
        <group
          key={i}
          ref={(el) => { groups.current[i] = el; }}
          position={[s.side * (PALM_CONFIG.offsetFromRoad + s.jitter), 0, -s.dist]}
        >
          <PalmTreeAsset position={[0, 0, 0]} variant={looks[i].variant} colorMode={looks[i].colorMode} />
        </group>
      ))}
    </>
  );
}

const BUILDING_VARIANTS = [
  { Asset: Storey1, config: BUILDING_ASSET_CONFIGS.storey1 },
  { Asset: Storey10, config: BUILDING_ASSET_CONFIGS.storey10 },
  { Asset: StoreyGeneric, config: BUILDING_ASSET_CONFIGS.storeyGeneric },
];

export function DecorBuildings() {
  const COUNT = 40; // 20 per side
  const spacing = BUILDING_CONFIG.spacing;
  const span = Math.ceil(COUNT / 2) * spacing;
  const slots = useDecorSlots(COUNT, spacing, BUILDING_CONFIG.offsetJitter);
  const groups = useRef<(THREE.Group | null)[]>([]);

  const looks = useMemo(
    () =>
      slots.map(() => ({
        variant: BUILDING_VARIANTS[Math.floor(Math.random() * BUILDING_VARIANTS.length)],
        yaw: Math.random() * Math.PI * 2,
        colorMode: (Math.random() < 0.5 ? 'greyConcrete' : 'original') as ColorMode,
      })),
    [slots]
  );

  useFrame(() => {
    const cd = driveState.dist;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      while (s.dist < cd - G.recycleBehind) s.dist += span;
      const g = groups.current[i];
      if (g) g.position.set(s.side * (BUILDING_CONFIG.offsetFromRoad + s.jitter), 0, -s.dist);
    }
  });

  return (
    <>
      {slots.map((s, i) => (
        <group
          key={i}
          ref={(el) => { groups.current[i] = el; }}
          position={[s.side * (BUILDING_CONFIG.offsetFromRoad + s.jitter), 0, -s.dist]}
        >
          <GroundedAsset
            Asset={looks[i].variant.Asset}
            config={looks[i].variant.config}
            position={[0, 0, 0]}
            extraRotationY={looks[i].yaw}
            colorMode={looks[i].colorMode}
          />
        </group>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Obstacles — pooled traffic cones spawned ahead of the car.                 */
/*                                                                            */
/*  A spawn cursor drops one cone per "row". Only ONE lane is ever blocked in  */
/*  a row, so a clear lane always exists. As difficulty rises the rows come    */
/*  closer together and are more likely to force a lane change — the challenge  */
/*  builds gradually while every cone stays avoidable.                          */
/* -------------------------------------------------------------------------- */

function Cone() {
  return (
    <group>
      <RoundedBox args={[1.0, 0.18, 1.0]} radius={0.08} smoothness={3} position={[0, 0.09, 0]} castShadow>
        <meshStandardMaterial color="#1c1522" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.75, 0]} castShadow>
        <coneGeometry args={[0.5, 1.3, 20]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.38, 0.32, 20]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#ff6a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

type Slot = { active: boolean; dist: number; lane: number };

export function ObstacleField() {
  const POOL = 16;
  const groups = useRef<(THREE.Group | null)[]>([]);
  const slots = useRef<Slot[]>(
    Array.from({ length: POOL }, () => ({ active: false, dist: 0, lane: 0 }))
  );
  const cursor = useRef(G.obstacleSafeStart);
  const lastLane = useRef(1);
  const runId = useGameStore((s) => s.runId);

  useEffect(() => {
    slots.current.forEach((s) => {
      s.active = false;
      s.dist = 0;
      s.lane = 0;
    });
    cursor.current = G.obstacleSafeStart;
    lastLane.current = 1;
    driveState.obstacles = [];
  }, [runId]);

  useFrame(() => {
    const st = useGameStore.getState();
    if (st.crashed || st.paused) return;

    const cd = driveState.dist;
    const diff = driveState.difficulty;

    // recycle rows the car has passed
    for (const s of slots.current) {
      if (s.active && s.dist < cd - G.recycleBehind) s.active = false;
    }

    // spawn rows to fill the window ahead
    const spacing = lerp(G.obstacleSpacingEasy, G.obstacleSpacingHard, diff);
    const switchChance = lerp(G.obstacleSwitchChanceEasy, G.obstacleSwitchChanceHard, diff);
    while (cursor.current < cd + G.spawnAhead) {
      const free = slots.current.find((s) => !s.active);
      if (!free) break;
      const dir = Math.random() < switchChance ? -lastLane.current : Math.random() < 0.5 ? -1 : 1;
      free.active = true;
      free.dist = cursor.current;
      free.lane = dir * G.laneX;
      lastLane.current = dir;
      // vary the gap a little so rows never feel metronomic
      cursor.current += spacing + Math.random() * spacing * 0.5;
    }

    // position, collide, and publish active rows for the coin field
    const carX = driveState.lateral;
    const pub: { dist: number; lane: number }[] = [];
    for (let i = 0; i < POOL; i++) {
      const s = slots.current[i];
      const g = groups.current[i];
      if (!g) continue;
      g.visible = s.active;
      if (!s.active) continue;
      g.position.set(s.lane, 0, -s.dist);
      pub.push({ dist: s.dist, lane: s.lane });
      if (Math.abs(s.dist - cd) < G.collisionZ && Math.abs(s.lane - carX) < G.collisionX) {
        st.crash();
      }
    }
    driveState.obstacles = pub;
  });

  return (
    <>
      {Array.from({ length: POOL }).map((_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          <Cone />
        </group>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coins — pooled, spinning, bobbing pickups.                                 */
/*                                                                            */
/*  Common and closely spaced early, gradually rarer (but never gone) and      */
/*  worth more later. A coin is never dropped where an obstacle in the same     */
/*  lane would force an unavoidable crash to reach it.                          */
/* -------------------------------------------------------------------------- */

function CoinMesh() {
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.16, 24]} />
        <meshStandardMaterial color="#ffd23f" emissive="#ffb700" emissiveIntensity={0.55} metalness={0.75} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.08, 12, 28]} />
        <meshStandardMaterial color="#ffe98a" emissive="#ffcf3a" emissiveIntensity={0.5} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#fff2b0" emissive="#ffdf6a" emissiveIntensity={0.6} />
      </mesh>
    </>
  );
}

type CoinSlot = { active: boolean; dist: number; lane: number; collected: boolean; phase: number };

export function CoinField() {
  const POOL = 30;
  const groups = useRef<(THREE.Group | null)[]>([]);
  const slots = useRef<CoinSlot[]>(
    Array.from({ length: POOL }, () => ({ active: false, dist: 0, lane: 0, collected: false, phase: Math.random() * Math.PI * 2 }))
  );
  const cursor = useRef(G.coinStart);
  const runId = useGameStore((s) => s.runId);

  useEffect(() => {
    slots.current.forEach((s) => {
      s.active = false;
      s.collected = false;
      s.dist = 0;
      s.lane = 0;
    });
    cursor.current = G.coinStart;
  }, [runId]);

  useFrame((state) => {
    const st = useGameStore.getState();
    if (st.crashed || st.paused) return;

    const cd = driveState.dist;
    const diff = driveState.difficulty;
    const t = state.clock.elapsedTime;

    for (const s of slots.current) {
      if (s.active && s.dist < cd - G.recycleBehind) s.active = false;
    }

    const spacing = lerp(G.coinSpacingEasy, G.coinSpacingHard, diff);
    while (cursor.current < cd + G.spawnAhead) {
      const free = slots.current.find((s) => !s.active);
      if (!free) break;
      let lane = (Math.random() < 0.5 ? -1 : 1) * G.laneX;
      // never place a coin where an obstacle in the same lane would force a hit
      for (const o of driveState.obstacles) {
        if (Math.abs(o.dist - cursor.current) < G.collisionZ + G.coinGrabZ && Math.abs(o.lane - lane) < 0.1) {
          lane = -lane;
          break;
        }
      }
      free.active = true;
      free.collected = false;
      free.dist = cursor.current;
      free.lane = lane;
      cursor.current += spacing + Math.random() * spacing * 0.4;
    }

    const carX = driveState.lateral;
    const value = Math.round(G.coinValue * (1 + diff)); // worth more the deeper you go
    for (let i = 0; i < POOL; i++) {
      const s = slots.current[i];
      const g = groups.current[i];
      if (!g) continue;
      const show = s.active && !s.collected;
      g.visible = show;
      if (!show) continue;
      g.position.set(s.lane, 1.1 + Math.sin(t * 3 + s.phase) * 0.12, -s.dist);
      g.rotation.y = t * 2.6;
      if (Math.abs(s.dist - cd) < G.coinGrabZ && Math.abs(s.lane - carX) < G.coinGrabX) {
        s.collected = true;
        g.visible = false;
        st.addScore(value);
      }
    }
  });

  return (
    <>
      {Array.from({ length: POOL }).map((_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          <CoinMesh />
        </group>
      ))}
    </>
  );
}

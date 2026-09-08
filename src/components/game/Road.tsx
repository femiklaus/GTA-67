'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { buildRoadGeometry } from '@/lib/road-geometry';
import { ROAD_CONFIG } from '@/config/environment.config';

function useRoadTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const totalWidth = ROAD_CONFIG.width + ROAD_CONFIG.shoulderWidth * 2;
    const shoulderPx = (ROAD_CONFIG.shoulderWidth / totalWidth) * canvas.width;
    const roadPx = canvas.width - shoulderPx * 2;

    // shoulders on both sides
    ctx.fillStyle = ROAD_CONFIG.shoulderColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // asphalt driving surface
    ctx.fillStyle = ROAD_CONFIG.asphaltColor;
    ctx.fillRect(shoulderPx, 0, roadPx, canvas.height);

    // solid white edge lines
    ctx.fillStyle = ROAD_CONFIG.edgeLineColor;
    ctx.fillRect(shoulderPx, 0, 4, canvas.height);
    ctx.fillRect(shoulderPx + roadPx - 4, 0, 4, canvas.height);

    // dashed yellow center line
    ctx.fillStyle = ROAD_CONFIG.laneMarkingColor;
    const centerX = shoulderPx + roadPx / 2 - 3;
    for (let y = 0; y < canvas.height; y += 48) {
      ctx.fillRect(centerX, y, 6, 26);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping; // don't tile across the width
    tex.wrapT = THREE.RepeatWrapping;      // tile along the road's length
    return tex;
  }, []);
}

export function Road({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const totalWidth = ROAD_CONFIG.width + ROAD_CONFIG.shoulderWidth * 2;
  const geometry = useMemo(
    () => buildRoadGeometry(curve, totalWidth, ROAD_CONFIG.segments),
    [curve, totalWidth]
  );
  const texture = useRoadTexture();

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}
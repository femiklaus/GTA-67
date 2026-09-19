'use client';
import { Suspense, useLayoutEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import * as THREE from 'three';
import type { StaticAssetConfig } from '@/config/assets.config';

export type ColorMode =
  | 'original' // keep the GLB's baked (sunset) look
  | 'greenGradient' // deep→light green up the height
  | 'lightGreen' // lush light green
  | 'darkGreen' // deep forest green
  | 'greyConcrete'; // grey concrete skyscraper

interface GroundedAssetProps {
  Asset: ComponentType<any>;
  config: StaticAssetConfig;
  position: [number, number, number];
  extraRotationY?: number; // per-instance random yaw, so a whole row of the same building doesn't look copy-pasted
  colorMode?: ColorMode; // repaints the asset up its height; 'original' keeps the GLB's baked look
}

// Each non-original mode is a vertical low→high colour ramp (RGB 0..1).
const GRADIENTS: Record<
  Exclude<ColorMode, 'original'>,
  { low: [number, number, number]; high: [number, number, number] }
> = {
  greenGradient: { low: [0.04, 0.3, 0.1], high: [0.4, 0.9, 0.38] },
  lightGreen: { low: [0.28, 0.68, 0.32], high: [0.62, 0.95, 0.55] },
  darkGreen: { low: [0.02, 0.16, 0.06], high: [0.16, 0.44, 0.2] },
  greyConcrete: { low: [0.2, 0.21, 0.24], high: [0.6, 0.62, 0.68] },
};

const glsl = (v: [number, number, number]) =>
  `vec3(${v[0].toFixed(3)}, ${v[1].toFixed(3)}, ${v[2].toFixed(3)})`;

// Repaint every mesh under `root` with a vertical low→high colour gradient,
// driven by each geometry's own local Y range. Materials are cloned first so
// only this instance changes — the shared GLB material cache is never touched.
function applyGradient(
  root: THREE.Object3D,
  low: [number, number, number],
  high: [number, number, number]
) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    mesh.geometry.computeBoundingBox?.();
    const bb = mesh.geometry.boundingBox;
    if (!bb) return;
    const minY = bb.min.y;
    const maxY = bb.max.y;

    const recolor = (mat: THREE.Material) => {
      const m = mat.clone() as THREE.MeshStandardMaterial;
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uMinY = { value: minY };
        shader.uniforms.uMaxY = { value: maxY };
        shader.vertexShader =
          'varying float vLocalY;\n' +
          shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\n  vLocalY = position.y;'
          );
        shader.fragmentShader =
          'varying float vLocalY;\nuniform float uMinY;\nuniform float uMaxY;\n' +
          shader.fragmentShader.replace(
            '#include <color_fragment>',
            `#include <color_fragment>\n  float _t = clamp((vLocalY - uMinY) / max(uMaxY - uMinY, 0.001), 0.0, 1.0);\n  vec3 _low = ${glsl(low)};\n  vec3 _high = ${glsl(high)};\n  diffuseColor.rgb = mix(_low, _high, _t);`
          );
      };
      m.needsUpdate = true;
      return m;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(recolor)
      : recolor(mesh.material);
  });
}

// Every static model (building, palm, prop) should render through this
// wrapper instead of being dropped into the scene directly. It's the one
// place that applies each asset's ground-angle correction and now also drops
// each instance onto the ground plane at runtime (so trunks/foundations show,
// nothing is buried or floating) plus optional per-instance recolouring.
export function GroundedAsset({
  Asset,
  config,
  position,
  extraRotationY = 0,
  colorMode = 'original',
}: GroundedAssetProps) {
  const ref = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    if (colorMode !== 'original') {
      const grad = GRADIENTS[colorMode];
      applyGradient(g, grad.low, grad.high);
    }

    // Ground so the asset's lowest point rests at (position.y + yOffset): the
    // trunk base / foundation sits on the terrain and the stem shows fully.
    g.updateWorldMatrix(true, true);
    const parentY = g.parent
      ? new THREE.Vector3().setFromMatrixPosition(g.parent.matrixWorld).y
      : 0;
    const box = new THREE.Box3().setFromObject(g);
    if (!isFinite(box.min.y)) return; // asset not resolved yet — skip
    const modelMinRel = box.min.y - parentY - g.position.y;
    g.position.y = position[1] + config.yOffset - modelMinRel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode, position[0], position[1], position[2], config.yOffset, config.scale]);

  return (
    <Suspense fallback={null}>
      <group ref={ref} position={[position[0], position[1] + config.yOffset, position[2]]}>
        <Asset
          scale={config.scale}
          rotation={[config.rotationX, config.rotationY + extraRotationY, config.rotationZ]}
        />
      </group>
    </Suspense>
  );
}

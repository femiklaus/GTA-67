'use client';
import { useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { CAR_CONFIG } from '@/config/car.config';

/*
  The player's car — the real /models/car.glb asset.

  We clone the loaded scene (so multiple mounts never share one object graph)
  and render it through <primitive>, which draws every mesh in the file
  regardless of node names — robust against however the GLB was exported.

  Two runtime touches applied here (both instance-safe — materials are cloned,
  never the shared cache):
    1. Blue paint: the bright body panels are recoloured blue; very dark parts
       (tyres, glass, trim) are left dark so the wheels still read as tyres.
    2. Grounding: after mount we measure the transformed bounding box and drop
       the group so the lowest point (the tyres) rests exactly on the road
       plane (local y = 0 of the driving rig).
*/

useGLTF.preload('/models/car.glb');

const CAR_BODY_COLOR = new THREE.Color('#bfe4ff'); // soft, light sky blue

export function CarModel() {
  const { scene } = useGLTF('/models/car.glb');
  const outer = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = false;

      // Clone the material(s) for this instance, then paint bright panels blue
      // while leaving dark parts (tyres/glass) alone.
      const paint = (mat: THREE.Material) => {
        const m = mat.clone() as THREE.MeshStandardMaterial;
        const c = m.color;
        if (c) {
          const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
          if (lum > 0.18) c.copy(CAR_BODY_COLOR);
        }
        return m;
      };
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(paint)
        : paint(mesh.material);
    });
    return clone;
  }, [scene]);

  // Ground the car so the tyres touch the road: measure the fully-transformed
  // bounding box and shift the outer group up by its lowest point. Yaw (the
  // only rotation the driving rig applies to our parent) never changes the
  // vertical extent, so this holds as the car drives.
  useLayoutEffect(() => {
    const g = outer.current;
    if (!g) return;
    g.updateWorldMatrix(true, true);
    const parentY = g.parent
      ? new THREE.Vector3().setFromMatrixPosition(g.parent.matrixWorld).y
      : 0;
    const box = new THREE.Box3().setFromObject(g);
    if (!isFinite(box.min.y)) return; // asset not resolved yet — skip
    const modelMinRel = box.min.y - parentY - g.position.y; // lowest point vs g origin
    g.position.y = CAR_CONFIG.assetYOffset - modelMinRel;
  }, [model]);

  // Free the cloned graph + cloned materials when the car unmounts.
  useEffect(() => () => {
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose?.();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
      else mat?.dispose?.();
    });
  }, [model]);

  // Nested groups apply the transforms in a predictable order:
  //   1. inner: stand the model upright (up-axis fix)
  //   2. middle: yaw it to face forward (-Z)
  //   3. outer: scale + ground offset (grounded at runtime above)
  return (
    <group ref={outer} position={[0, CAR_CONFIG.assetYOffset, 0]} scale={CAR_CONFIG.assetScale}>
      <group rotation={[0, CAR_CONFIG.assetRotationY, CAR_CONFIG.assetRotationZ]}>
        <group rotation={[CAR_CONFIG.assetRotationX, 0, 0]}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

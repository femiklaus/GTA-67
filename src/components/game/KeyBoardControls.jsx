'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';

// Renders nothing — just wires the physical keyboard into the shared controls store.
export function KeyboardControls() {
  const setControl = useGameStore((s) => s.setControl);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setControl('left', true);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setControl('right', true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setControl('left', false);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setControl('right', false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [setControl]);

  return null;
}
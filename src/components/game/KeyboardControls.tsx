'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';

export function KeyboardControls() {
  const setControl = useGameStore((s) => s.setControl);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setControl('left', true);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setControl('right', true);
      if (e.key === ' ' || e.key === 'ArrowDown') setControl('brake', true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setControl('left', false);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setControl('right', false);
      if (e.key === ' ' || e.key === 'ArrowDown') setControl('brake', false);
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
  return null;
}
import { create } from 'zustand';

type Gender = 'male' | 'female';
interface Controls {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  brake: boolean;
}

interface GameState {
  gender: Gender;
  avatarDataUrl: string | null;
  controls: Controls;
  score: number;
  crashed: boolean;
  // Freezes the world (car, camera, obstacle/coin motion) without touching the
  // score. Unpausing resumes exactly where it left off.
  paused: boolean;
  // Bumped on every reset. Scene reads it to hard-reset the run (car position,
  // coins, speed) so nothing survives a fail/retry.
  runId: number;
  setGender: (g: Gender) => void;
  setAvatar: (url: string) => void;
  setControl: (key: keyof Controls, value: boolean) => void;
  addScore: (n: number) => void;
  crash: () => void;
  setPaused: (v: boolean) => void;
  togglePause: () => void;
  resetRun: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gender: 'male',
  avatarDataUrl: null,
  controls: { left: false, right: false, accelerate: false, brake: false },
  score: 0,
  crashed: false,
  paused: false,
  runId: 0,
  setGender: (gender) => set({ gender }),
  setAvatar: (avatarDataUrl) => set({ avatarDataUrl }),
  setControl: (key, value) =>
    set((state) => ({ controls: { ...state.controls, [key]: value } })),
  addScore: (n) => set((state) => ({ score: state.score + n })),
  crash: () => set({ crashed: true }),
  setPaused: (paused) => set({ paused }),
  // Never pause while the crash overlay is up.
  togglePause: () => set((state) => (state.crashed ? {} : { paused: !state.paused })),
  // A retry/reset must wipe the score completely (no persistence in state or
  // storage) and advance runId so the Scene rewinds the car and coins.
  resetRun: () =>
    set((state) => ({ crashed: false, paused: false, score: 0, runId: state.runId + 1 })),
}));
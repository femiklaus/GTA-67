import { create } from 'zustand';

type Gender = 'male' | 'female';
interface Controls {
  left: boolean;
  right: boolean;
  brake: boolean;
}

interface GameState {
  gender: Gender;
  avatarDataUrl: string | null;
  controls: Controls;
  score: number;
  crashed: boolean;
  setGender: (g: Gender) => void;
  setAvatar: (url: string) => void;
  setControl: (key: keyof Controls, value: boolean) => void;
  addScore: (n: number) => void;
  crash: () => void;
  resetRun: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gender: 'male',
  avatarDataUrl: null,
  controls: { left: false, right: false, brake: false },
  score: 0,
  crashed: false,
  setGender: (gender) => set({ gender }),
  setAvatar: (avatarDataUrl) => set({ avatarDataUrl }),
  setControl: (key, value) =>
    set((state) => ({ controls: { ...state.controls, [key]: value } })),
  addScore: (n) => set((state) => ({ score: state.score + n })),
  crash: () => set({ crashed: true }),
  resetRun: () => set({ crashed: false }),
}));
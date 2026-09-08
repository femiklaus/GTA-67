import { create } from 'zustand';

type Gender = 'male' | 'female';
interface Controls {
  left: boolean;
  right: boolean;
}

interface GameState {
  gender: Gender;
  avatarDataUrl: string | null;
  controls: Controls;
  setGender: (g: Gender) => void;
  setAvatar: (url: string) => void;
  setControl: (key: keyof Controls, value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gender: 'male',
  avatarDataUrl: null,
  controls: { left: false, right: false },
  setGender: (gender) => set({ gender }),
  setAvatar: (avatarDataUrl) => set({ avatarDataUrl }),
  setControl: (key, value) =>
    set((state) => ({ controls: { ...state.controls, [key]: value } })),
}));
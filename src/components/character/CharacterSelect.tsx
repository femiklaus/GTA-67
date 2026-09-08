'use client';
import { useGameStore } from '@/lib/store';
import { CHARACTER_CONFIG } from '@/config/character.config';

export function CharacterSelect({ onPicked }: { onPicked: (baseImage: string) => void }) {
  const setGender = useGameStore((s) => s.setGender);

  const pick = (gender: 'male' | 'female') => {
    setGender(gender);
    onPicked(CHARACTER_CONFIG.baseAvatars[gender]);
  };

  return (
    <div style={{ display: 'flex', gap: 24, justifyContent: 'center', padding: 40 }}>
      {(['male', 'female'] as const).map((g) => (
        <button
          key={g}
          onClick={() => pick(g)}
          style={{
            padding: 20,
            borderRadius: 16,
            border: '2px solid #333',
            background: '#111',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <img
            src={CHARACTER_CONFIG.baseAvatars[g]}
            style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 10 }}
          />
          <div style={{ marginTop: 8, textTransform: 'capitalize' }}>{g}</div>
        </button>
      ))}
    </div>
  );
}
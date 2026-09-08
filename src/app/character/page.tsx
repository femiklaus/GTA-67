'use client';
import { useState } from 'react';
import { CharacterSelect } from '@/components/character/CharacterSelect';
import { AvatarEditor } from '@/components/character/AvatarEditor';

export default function CharacterPage() {
  const [baseImage, setBaseImage] = useState<string | null>(null);

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0d' }}>
      <h1 style={{ color: 'white', textAlign: 'center', paddingTop: 24 }}>Choose your driver</h1>
      {!baseImage ? (
        <CharacterSelect onPicked={setBaseImage} />
      ) : (
        <AvatarEditor baseImage={baseImage} />
      )}
    </main>
  );
}
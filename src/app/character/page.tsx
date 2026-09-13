'use client';
import { useState } from 'react';
import { CharacterSelect } from '@/components/character/CharacterSelect';
import { AvatarEditor } from '@/components/character/AvatarEditor';

export default function CharacterPage() {
  const [baseImage, setBaseImage] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url('/background1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 style={{ color: 'white', textAlign: 'center', paddingTop: 24 }}>Choose your driver</h1>
      {!baseImage ? (
        <CharacterSelect onPicked={setBaseImage} />
      ) : (
        <AvatarEditor baseImage={baseImage} />
      )}
    </main>
  );
}
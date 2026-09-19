'use client';
import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { CHARACTER_CONFIG } from '@/config/character.config';

/*
  Character edition — powered by the Unlayer React Image Editor.

  This is the hackathon's required Unlayer surface: the player picks a base
  driver photo, then crops / filters / draws / adds text & stickers on it in
  the Unlayer editor, and the saved image becomes their in-game driver
  (shown on the HUD). Loaded client-only (the editor touches the DOM).
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageEditor = dynamic<any>(() => import('@unlayer/react-image-editor'), {
  ssr: false,
  loading: () => <EditorSpinner label="Loading image editor…" />,
});

function EditorSpinner({ label }: { label: string }) {
  return (
    <div
      style={{
        minHeight: 460,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        color: 'white',
      }}
    >
      <div className="gta67-spinner" />
      <div style={{ fontWeight: 700, opacity: 0.9 }}>{label}</div>
    </div>
  );
}

type Gender = 'male' | 'female';

// Minimal shape of the Unlayer editor instance we rely on.
interface EditorInstance {
  getImage: () => string | null;
}

export function CharacterEditor() {
  const router = useRouter();
  const setAvatar = useGameStore((s) => s.setAvatar);
  const setGender = useGameStore((s) => s.setGender);

  const [gender, setLocalGender] = useState<Gender>('male');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const editorRef = useRef<EditorInstance | null>(null);

  const baseImage = CHARACTER_CONFIG.baseAvatars[gender];

  const chooseGender = (g: Gender) => {
    setLocalGender(g);
    setGender(g);
    setReady(false); // editor remounts with the new base image
  };

  const startDriving = useCallback(
    (explicitDataUrl?: string) => {
      setBusy(true);
      const dataUrl = explicitDataUrl || editorRef.current?.getImage() || baseImage;
      setAvatar(dataUrl);
      router.push('/play');
    },
    [baseImage, router, setAvatar]
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 40px' }}>
      {/* base-driver / gender picker */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
        {(['male', 'female'] as Gender[]).map((g) => (
          <button
            key={g}
            onClick={() => chooseGender(g)}
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              border: '2px solid rgba(255,255,255,0.7)',
              background: gender === g ? 'white' : 'rgba(255,255,255,0.15)',
              color: gender === g ? '#1a0f2e' : 'white',
              fontWeight: 800,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {g} driver
          </button>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.35)',
          background: 'rgba(0,0,0,0.35)',
          minHeight: 460,
        }}
      >
        {!ready && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
            <EditorSpinner label="Loading image editor…" />
          </div>
        )}
        <ImageEditor
          key={gender} /* reload the base photo when the driver changes */
          image={baseImage}
          minHeight={460}
          options={{ theme: 'dark' }}
          onLoad={(editor: EditorInstance) => {
            editorRef.current = editor;
            setReady(true);
          }}
          onSave={({ dataUrl }: { dataUrl: string }) => startDriving(dataUrl)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        <button
          onClick={() => startDriving()}
          disabled={busy}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            border: 'none',
            background: busy ? 'rgba(255,255,255,0.6)' : '#7cc0ff',
            color: '#0d2033',
            fontWeight: 900,
            fontSize: 18,
            cursor: busy ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
          }}
        >
          {busy && <span className="gta67-spinner small" />}
          {busy ? 'Starting…' : 'Use this character  →  Drive'}
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 10, fontSize: 13 }}>
        Crop, filter, draw, add text or stickers to your driver — then hit “Use this character”.
      </p>
    </div>
  );
}

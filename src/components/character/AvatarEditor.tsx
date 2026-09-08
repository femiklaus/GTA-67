'use client';
import { useRef } from 'react';
import ImageEditor, { type ImageEditorRef } from '@unlayer/react-image-editor';
import { useGameStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export function AvatarEditor({ baseImage }: { baseImage: string }) {
  const editorRef = useRef<ImageEditorRef>(null);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const router = useRouter();

  const handleContinue = () => {
    const dataUrl = editorRef.current?.editor?.getImage();
    if (!dataUrl) return; // editor not ready yet, ignore the click
    setAvatar(dataUrl);
    router.push('/play');
  };

  return (
    <div>
      <ImageEditor
        ref={editorRef}
        image={baseImage}
        minHeight="700px"
        options={{
          projectId: Number(process.env.NEXT_PUBLIC_UNLAYER_PROJECT_ID),
          theme: 'dark',
        }}
        onCancel={() => router.push('/character')}
      />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
        <button
          onClick={handleContinue}
          style={{
            padding: '12px 32px',
            borderRadius: 999,
            background: '#ff2b2b',
            color: 'white',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Done — Start Driving
        </button>
      </div>
    </div>
  );
}
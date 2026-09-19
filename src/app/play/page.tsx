'use client';
import dynamic from 'next/dynamic';
import { Hud } from '@/components/game/Hud';
import { Controls } from '@/components/game/Controls';
import { GameLoader } from '@/components/game/GameLoader';

const Scene = dynamic(() => import('@/components/game/Scene').then((m) => m.Scene), { ssr: false });

export default function PlayPage() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh', // dynamic viewport height — accounts for mobile browser chrome
        overflow: 'hidden',
        background: '#180a2e',
        touchAction: 'none', // prevents page scroll/zoom gestures from fighting the controls
        overscrollBehavior: 'none',
      }}
    >
      <Scene />
      <GameLoader />
      <Hud />
      <Controls />
    </div>
  );
}
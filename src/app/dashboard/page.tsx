'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Score {
  name: string;
  score: number;
  createdAt: string;
}

export default function Dashboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/scores', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        if (res.ok && data.ok && Array.isArray(data.scores)) {
          setScores(data.scores);
          setState('ready');
        } else {
          setState('error');
        }
      } catch {
        if (alive) setState('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const medal = (i: number) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a0f2e 0%, #2d1b4e 60%, #ff2d78 140%)',
        color: 'white',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 900, letterSpacing: 1 }}>
          GTA 67 — Miami Drive
        </div>
        <div style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: '#ffd23f', fontWeight: 700 }}>
          Global Leaderboard
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 520,
          marginTop: 24,
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        {state === 'loading' && (
          <div style={{ padding: 40, textAlign: 'center', opacity: 0.8 }}>Loading…</div>
        )}
        {state === 'error' && (
          <div style={{ padding: 40, textAlign: 'center', color: '#ff9a9a' }}>
            Could not load the leaderboard.
          </div>
        )}
        {state === 'ready' && scores.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', opacity: 0.8 }}>
            No scores yet — be the first!
          </div>
        )}
        {state === 'ready' &&
          scores.map((s, i) => (
            <div
              key={`${s.name}-${s.createdAt}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 20px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: i < 3 ? 'rgba(255,210,63,0.08)' : 'transparent',
              }}
            >
              <div style={{ width: 34, fontSize: 20, fontWeight: 800, textAlign: 'center' }}>
                {medal(i)}
              </div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>{s.name}</div>
              <div style={{ color: '#ffd23f', fontWeight: 900, fontSize: 18 }}>
                🪙 {s.score}
              </div>
            </div>
          ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/play"
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            background: '#ffd23f',
            color: '#1a0f2e',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Play
        </Link>
        <Link
          href="/"
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Home
        </Link>
      </div>
    </main>
  );
}

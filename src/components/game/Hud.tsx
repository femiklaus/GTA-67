'use client';
// HUD: score, pause button + pause overlay (with dashboard link), and the
// crash/score-submit flow.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';

type SubmitState = 'idle' | 'saving' | 'done' | 'error';

export function Hud() {
  const avatarDataUrl = useGameStore((s) => s.avatarDataUrl);
  const score = useGameStore((s) => s.score);
  const crashed = useGameStore((s) => s.crashed);
  const paused = useGameStore((s) => s.paused);
  const togglePause = useGameStore((s) => s.togglePause);
  const setPaused = useGameStore((s) => s.setPaused);
  const resetRun = useGameStore((s) => s.resetRun);

  const [name, setName] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [rank, setRank] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [recognized, setRecognized] = useState(false);

  // Recognise the player: first their IP (server-side, cross-device on the same
  // network), then a locally remembered name as a fallback.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/scores/me', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data?.found && typeof data.name === 'string') {
          setName(data.name);
          setRecognized(true);
          return;
        }
      } catch {}
      if (cancelled) return;
      try {
        const saved = localStorage.getItem('gta67_name');
        if (saved) setName(saved);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitScore = async () => {
    const clean = name.trim();
    if (!clean) {
      setError('Enter a name first.');
      return;
    }
    setSubmitState('saving');
    setError('');
    try {
      try { localStorage.setItem('gta67_name', clean); } catch {}
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean, score }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setRank(typeof data.rank === 'number' ? data.rank : null);
        setSubmitState('done');
      } else {
        setError(data.error || 'Could not save score.');
        setSubmitState('error');
      }
    } catch {
      setError('Network error. Try again.');
      setSubmitState('error');
    }
  };

  const retry = () => {
    setSubmitState('idle');
    setRank(null);
    setError('');
    resetRun();
  };

  // Keyboard shortcut: P or Esc pauses / resumes (the store guards against
  // pausing while the crash overlay is up).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePause]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: 'var(--font-rounded), system-ui, sans-serif' }}>
      {avatarDataUrl && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 64,
            height: 42,
            borderRadius: 10,
            border: '2px solid rgba(255,255,255,0.6)',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <img src={avatarDataUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#ffd23f',
          fontWeight: 800,
          fontSize: 'clamp(20px, 4vw, 28px)',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        🪙 {score}
      </div>

      {/* Pause button — top-right, hidden while the pause or crash overlay is up. */}
      {!crashed && !paused && (
        <button
          onClick={togglePause}
          aria-label="Pause"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 46,
            height: 46,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.45)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.55)',
            fontSize: 18,
            fontWeight: 800,
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ❚❚
        </button>
      )}

      {/* Pause overlay — resumes at the same score; includes the dashboard link. */}
      {paused && !crashed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            pointerEvents: 'auto',
            color: 'white',
            padding: 20,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900 }}>Paused</div>
          <div style={{ fontSize: 18 }}>Score: {score}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setPaused(false)}
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                background: '#22c55e',
                color: '#08240f',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Resume
            </button>
            <Link
              href="/dashboard"
              style={{
                padding: '12px 24px',
                borderRadius: 999,
                background: 'white',
                color: '#1a0f2e',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              View dashboard
            </Link>
          </div>
        </div>
      )}

      {crashed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            pointerEvents: 'auto',
            color: 'white',
            padding: 20,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 900 }}>Crashed!</div>
          <div style={{ fontSize: 18 }}>Score: {score}</div>
          {recognized && submitState !== 'done' && (
            <div style={{ fontSize: 14, color: '#ffd23f', fontWeight: 700 }}>
              Welcome back, {name}! 👋
            </div>
          )}

          {submitState !== 'done' ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Your name"
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  fontSize: 16,
                  width: 220,
                  maxWidth: '80vw',
                  textAlign: 'center',
                }}
              />
              {error && <div style={{ color: '#ff8080', fontSize: 13 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={submitScore}
                  disabled={submitState === 'saving'}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 999,
                    background: '#22c55e',
                    color: '#08240f',
                    fontWeight: 800,
                    border: 'none',
                    cursor: submitState === 'saving' ? 'default' : 'pointer',
                    opacity: submitState === 'saving' ? 0.75 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {submitState === 'saving' && <span className="gta67-spinner small" />}
                  {submitState === 'saving' ? 'Saving…' : 'Submit score'}
                </button>
                <button
                  onClick={retry}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 999,
                    background: '#ff2b2b',
                    color: 'white',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 18, color: '#ffd23f', fontWeight: 800 }}>
                Saved!{rank ? ` You're #${rank}` : ''}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                  href="/dashboard"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 999,
                    background: 'white',
                    color: '#1a0f2e',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  View leaderboard
                </Link>
                <button
                  onClick={retry}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 999,
                    background: '#ff2b2b',
                    color: 'white',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

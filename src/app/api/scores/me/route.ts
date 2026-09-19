import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getClientIp } from '@/lib/ip';

// Recognises a returning player by their IP so the game can greet them and
// pre-fill their name — no accounts, no cookies.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLLECTION = 'scores';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const db = await getDb();
    const doc = await db
      .collection(COLLECTION)
      .findOne({ ip }, { projection: { _id: 0, name: 1, score: 1 } });

    if (!doc) return NextResponse.json({ ok: true, found: false });
    return NextResponse.json({ ok: true, found: true, name: doc.name, best: doc.score });
  } catch (err) {
    console.error('GET /api/scores/me failed:', err);
    return NextResponse.json({ ok: false, found: false }, { status: 500 });
  }
}

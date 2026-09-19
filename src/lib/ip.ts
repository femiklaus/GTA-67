// Best-effort client IP extraction. On Vercel the real client IP is the first
// entry of x-forwarded-for; we fall back to x-real-ip. Used to tie a
// leaderboard entry to a player so one IP never spawns two names.
export function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

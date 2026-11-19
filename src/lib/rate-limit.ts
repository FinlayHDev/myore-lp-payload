// Small in-memory limiter: enough to stop a single client hammering the signup
// endpoint. Resets on restart, which is fine for a single-instance deployment.
const hits = new Map<string, number[]>()

export function isRateLimited(key: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k)
  }
  return recent.length > max
}

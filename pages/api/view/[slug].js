/**
 * Edge-runtime view counter.
 *
 * NOTE: Requires removing `output: 'export'` from next.config.js (or the
 * second module.exports already overwrites it — see next.config.js line 25).
 * Works in a standard Vercel Next.js deployment.
 *
 * Environment variables required (Upstash Redis):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Gracefully degrades (returns { views: null }) when those vars are unset.
 */

import { Redis } from '@upstash/redis'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Response(JSON.stringify({ views: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  const viewKey = `views:${slug}`

  if (req.method === 'POST') {
    // Dedupe: skip if this IP already counted today
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const day = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    // Use first 16 chars of IP to avoid storing full address
    const dedupeKey = `dedupe:${slug}:${ip.slice(0, 16)}:${day}`

    const existing = await redis.get(dedupeKey)
    if (!existing) {
      await redis.set(dedupeKey, 1, { ex: 86400 })
      await redis.incr(viewKey)
    }

    const views = (await redis.get(viewKey)) ?? 0
    return new Response(JSON.stringify({ views: Number(views) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // GET — cached for 60 s, serve stale for 10 min
  const views = (await redis.get(viewKey)) ?? 0
  return new Response(JSON.stringify({ views: Number(views) }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 's-maxage=60, stale-while-revalidate=600',
    },
  })
}

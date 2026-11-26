/**
 * High-Performance Sliding Window Rate Limiter
 * Architecture: MAION AI Technologies — Nammabus & JoinGroupLinks
 * Memory-bounded sliding window rate limiter with automatic eviction
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private cache: Map<string, RateLimitRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private maxEntries: number;

  constructor(maxRequests = 100, windowMs = 60000, maxEntries = 10000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.maxEntries = maxEntries;
  }

  public check(identifier: string): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Prevent unbounded Map growth under high-cardinality IP flood attacks
    if (this.cache.size >= this.maxEntries && !this.cache.has(identifier)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    let record = this.cache.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.cache.set(identifier, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetMs = Math.max(1000, oldestInWindow + this.windowMs - now);
      return { allowed: false, remaining: 0, resetMs };
    }

    record.timestamps.push(now);
    const remaining = this.maxRequests - record.timestamps.length;
    return { allowed: true, remaining, resetMs: this.windowMs };
  }

  public reset(identifier: string) {
    this.cache.delete(identifier);
  }
}

// Global default edge limiter instance (120 read req / min per IP)
export const edgeRateLimiter = new SlidingWindowRateLimiter(120, 60000);

// Stricter write limiter instance (20 POST/PUT/DELETE req / min per IP) to block UGC/API spam bots
export const writeRateLimiter = new SlidingWindowRateLimiter(20, 60000);

export type GoogleApiCacheStats = {
  hits: number;
  misses: number;
  expired: number;
  size: number;
};

type GoogleApiCacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export type GoogleApiCacheLookup<T> =
  | {
      hit: true;
      value: T;
    }
  | {
      hit: false;
    };

export class GoogleApiCache {
  private readonly entries = new Map<string, GoogleApiCacheEntry<unknown>>();
  private hits = 0;
  private misses = 0;
  private expired = 0;

  constructor(private readonly defaultTtlMs: number) {}

  get<T>(key: string): GoogleApiCacheLookup<T> {
    const entry = this.entries.get(key);

    if (!entry) {
      this.misses += 1;
      return { hit: false };
    }

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      this.expired += 1;
      this.misses += 1;
      return { hit: false };
    }

    this.hits += 1;

    return {
      hit: true,
      value: entry.value as T,
    };
  }

  set<T>(key: string, value: T, ttlMs = this.defaultTtlMs) {
    this.deleteExpired();
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(key?: string) {
    if (key) {
      this.entries.delete(key);
      return;
    }

    this.entries.clear();
  }

  invalidatePrefix(prefix: string) {
    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) {
        this.entries.delete(key);
      }
    }
  }

  getStats(): GoogleApiCacheStats {
    this.deleteExpired();

    return {
      hits: this.hits,
      misses: this.misses,
      expired: this.expired,
      size: this.entries.size,
    };
  }

  private deleteExpired() {
    const now = Date.now();

    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
        this.expired += 1;
      }
    }
  }
}

function normalizeCachePart(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, Object.keys(value).sort());
  }

  return String(value).trim().toLowerCase();
}

export function createGoogleApiCacheKey(namespace: string, ...parts: unknown[]) {
  return [namespace, ...parts.map(normalizeCachePart)].map(encodeURIComponent).join(":");
}

import { DEFAULT_SESSION_TIMEOUT_MS } from "@/features/tourism/providers/google-tourism-constants";

type SessionTimeout = ReturnType<typeof setTimeout>;

export class GoogleSessionTokenManager {
  private currentSessionToken: string | null = null;
  private expiresAtMs: number | null = null;
  private expirationTimer: SessionTimeout | null = null;

  constructor(private readonly timeoutMs = DEFAULT_SESSION_TIMEOUT_MS) {}

  generateSessionToken() {
    this.currentSessionToken = createSessionToken();
    this.refreshExpiration();

    return this.currentSessionToken;
  }

  getCurrentSessionToken() {
    if (this.isCurrentSessionExpired()) {
      this.resetSessionToken();
    }

    return this.currentSessionToken ?? this.generateSessionToken();
  }

  resetSessionToken() {
    this.currentSessionToken = null;
    this.expiresAtMs = null;

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  private refreshExpiration() {
    this.expiresAtMs = Date.now() + this.timeoutMs;

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }

    this.expirationTimer = setTimeout(() => {
      this.resetSessionToken();
    }, this.timeoutMs);
  }

  private isCurrentSessionExpired() {
    return typeof this.expiresAtMs === "number" && Date.now() >= this.expiresAtMs;
  }
}

const googleSessionTokenManager = new GoogleSessionTokenManager();

export function getGoogleSessionToken() {
  return googleSessionTokenManager.getCurrentSessionToken();
}

export function resetGoogleSessionToken() {
  googleSessionTokenManager.resetSessionToken();
}

function createSessionToken() {
  const cryptoApi = globalThis.crypto;

  if (typeof cryptoApi?.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }

  if (typeof cryptoApi?.getRandomValues === "function") {
    const randomBytes = new Uint8Array(16);
    cryptoApi.getRandomValues(randomBytes);

    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

const MAPPLS_RETRY_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAPPLS_RETRY_BACKOFF_MS = [500, 1000, 2000] as const;

type MapplsFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export async function fetchMapplsApi(input: RequestInfo | URL, init?: MapplsFetchInit): Promise<Response | undefined> {
  const signal = init?.signal ?? undefined;

  for (let attempt = 0; attempt <= MAPPLS_RETRY_BACKOFF_MS.length; attempt += 1) {
    if (signal?.aborted) {
      return undefined;
    }

    try {
      const response = await fetch(input, init);

      if (!shouldRetryMapplsResponse(response) || attempt === MAPPLS_RETRY_BACKOFF_MS.length) {
        return response;
      }
    } catch (error) {
      if (signal?.aborted || isAbortError(error)) {
        return undefined;
      }

      if (attempt === MAPPLS_RETRY_BACKOFF_MS.length) {
        throw error;
      }
    }

    const canContinue = await waitForRetryBackoff(MAPPLS_RETRY_BACKOFF_MS[attempt], signal);

    if (!canContinue) {
      return undefined;
    }
  }

  throw new Error("Mappls API request failed after retries.");
}

function shouldRetryMapplsResponse(response: Response) {
  return MAPPLS_RETRY_STATUS_CODES.has(response.status);
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function waitForRetryBackoff(delayMs: number, signal?: AbortSignal) {
  return new Promise<boolean>((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve(true);
    }, delayMs);

    function handleAbort() {
      clearTimeout(timeoutId);
      resolve(false);
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

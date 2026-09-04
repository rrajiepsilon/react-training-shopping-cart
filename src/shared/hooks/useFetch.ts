import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchState<T> {
  url: string | null | undefined;
  data: T | null;
  error: string | null;
}

interface Settled<T> {
  data: T | null;
  error: string | null;
}

// Populated by the prefetch bootstrap in index.html.
type PrefetchStore = Record<string, Promise<Settled<unknown>> | undefined>;

// index.html starts the slowest calls before this bundle loads. Each prefetched
// response is claimed once so later mounts still request fresh data.
function claimPrefetch<T>(url: string): Promise<Settled<T>> | undefined {
  const { __PREFETCH__: store } = window as Window & {
    __PREFETCH__?: PrefetchStore;
  };
  if (!store) return undefined;

  const pending = store[url];
  if (!pending) return undefined;

  delete store[url];
  return pending as Promise<Settled<T>>;
}

async function requestJson<T>(url: string): Promise<Settled<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return { data: (await response.json()) as T, error: null };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Request failed',
    };
  }
}

export function useFetch<T>(url: string | null | undefined): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    url: undefined,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    const pending = claimPrefetch<T>(url) ?? requestJson<T>(url);

    pending.then(({ data, error }) => {
      if (!cancelled) {
        setState({ url, data, error });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Results belong to the url they were fetched for, so a url change reads as loading.
  const settled = state.url === url;

  return {
    data: settled ? state.data : null,
    error: settled ? state.error : null,
    loading: Boolean(url) && !settled,
  };
}

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

export function useFetch<T>(url: string | null | undefined): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    url: undefined,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then((json) => {
        if (!cancelled) {
          setState({ url, data: json, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            url,
            data: null,
            error: error instanceof Error ? error.message : 'Request failed',
          });
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

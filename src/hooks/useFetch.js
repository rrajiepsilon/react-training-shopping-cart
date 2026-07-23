import { useState, useEffect } from "react";

/**
 * Reusable data-fetching hook.
 * Re-fetches whenever `url` changes. Returns { data, loading, error }.
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup avoids setting state on an unmounted component
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

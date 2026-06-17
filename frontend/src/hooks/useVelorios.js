import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchVelorios } from '../services/api.js';

const POLL_INTERVAL_MS = 30_000;

/**
 * @param {string} registro filtro por numero de registro (ja "debounced").
 */
export function useVelorios(registro) {
  const [velorios, setVelorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const hasLoadedRef = useRef(false);

  const load = useCallback(
    async (signal) => {
      if (hasLoadedRef.current) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await fetchVelorios({ registro, signal });
        if (signal?.aborted) return;
        setVelorios(data);
        setError(null);
        setLastUpdated(new Date());
        hasLoadedRef.current = true;
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Erro inesperado');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [registro]
  );

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(controller.signal);

    const intervalId = setInterval(() => {
      load(controller.signal);
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [load]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    load(controller.signal);
  }, [load]);

  return { velorios, loading, refreshing, error, lastUpdated, refetch };
}

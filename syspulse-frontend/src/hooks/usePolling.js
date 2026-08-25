import { useEffect, useRef, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

function usePolling(url, intervalMs = 3000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    axiosClient
      .get(url)
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  }, [url]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [fetchData, intervalMs]);

  return { data, error, refetch: fetchData };
}

export default usePolling;
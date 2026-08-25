import { useEffect, useRef, useState } from 'react';
import axiosClient from '../api/axiosClient';

function usePollingHistory(url, { intervalMs = 2000, windowSeconds = 60, select } = {}) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const selectRef = useRef(select);
  const isFetchingRef = useRef(false);
  selectRef.current = select;

  const maxPoints = Math.max(1, Math.round((windowSeconds * 1000) / intervalMs));

  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      if (isFetchingRef.current) return; // skip if previous request still in flight
      isFetchingRef.current = true;

      axiosClient
        .get(url)
        .then((res) => {
          if (!isMounted) return;
          setLatest(res.data);
          setError(null);

          const point = selectRef.current ? selectRef.current(res.data) : { value: res.data };
          const time = new Date().toLocaleTimeString([], { hour12: false });

          setHistory((prev) => {
            const next = [...prev, { time, ...point }];
            return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
          });
        })
        .catch((err) => {
          if (isMounted) setError(err.message);
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [url, intervalMs, maxPoints]);

  return { latest, history, error };
}

export default usePollingHistory;
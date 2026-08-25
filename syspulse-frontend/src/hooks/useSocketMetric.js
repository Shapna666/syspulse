import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

function useSocketMetric(eventName, { windowSeconds = 60, select } = {}) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const selectRef = useRef(select);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  const maxPoints = Math.max(1, Math.round((windowSeconds * 1000) / 3000));

  useEffect(() => {
    const handleUpdate = (data) => {
      setLatest(data);
      const point = selectRef.current ? selectRef.current(data) : { value: data };
      const time = new Date().toLocaleTimeString([], { hour12: false });

      setHistory((previous) => {
        const next = [...previous, { time, ...point }];
        return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
      });
    };

    socket.on(eventName, handleUpdate);
    return () => socket.off(eventName, handleUpdate);
  }, [eventName, maxPoints]);

  return { latest, history, error: null };
}

export default useSocketMetric;

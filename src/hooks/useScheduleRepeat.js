import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone'

export function useScheduleRepeat(callback, delay) {
  const savedCallback = useRef();
  const [idRef, setIdRef] = useState();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
    //   let id = setInterval(tick, delay);
      let id = Tone.Transport.scheduleRepeat(tick, delay)
      setIdRef(id)
      return () => clearInterval(id);
    }
  }, [delay]);

  return idRef;
}
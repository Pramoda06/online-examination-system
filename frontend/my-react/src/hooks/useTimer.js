import { useEffect, useRef, useState } from 'react';

const useTimer = (initialSeconds, onExpire) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (initialSeconds <= 0) {
      setSecondsLeft(0);
      return undefined;
    }

    setSecondsLeft(initialSeconds);

    const timerId = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timerId);
          window.setTimeout(() => onExpireRef.current?.(), 0);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [initialSeconds]);

  return secondsLeft;
};

export default useTimer;

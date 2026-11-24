import { useEffect, useState } from 'react';
import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

const getRemainingSeconds = (expiresAt: Date, now: Date) =>
  Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

const useVerificationTimer = () => {
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!expiresAt) return;

    const intervalId = setInterval(() => {
      const nextNow = new Date();
      setNow(nextNow);
      if (getRemainingSeconds(expiresAt, nextNow) === 0) clearInterval(intervalId);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const remainingSeconds = expiresAt ? getRemainingSeconds(expiresAt, now) : 0;

  const start = (nextExpiresAt: Date) => {
    setExpiresAt(nextExpiresAt);
    setNow(new Date());
  };

  const stop = () => setExpiresAt(null);

  return {
    isExpired: expiresAt !== null && remainingSeconds === 0,
    remainingTimeLabel: `${formatNumber(Math.floor(remainingSeconds / 60))}:${formatNumber(remainingSeconds % 60)}`,
    start,
    stop,
  };
};

export default useVerificationTimer;

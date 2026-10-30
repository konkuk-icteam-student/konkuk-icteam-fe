import { useEffect, useState } from 'react';
import { formatRemainingTime, getRemainingSeconds } from '../_utils/verificationTimer';

// 인증번호 남은 시간. 인증번호를 보낸 때 start로 시작하고, 1초마다 다시 센다
const useVerificationTimer = () => {
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!expiresAt) return;

    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const remainingSeconds = expiresAt ? getRemainingSeconds(expiresAt, now) : 0;

  // 만료 시각과 지금을 함께 정해 첫 화면부터 남은 시간이 맞게 보인다
  const start = (nextExpiresAt: Date) => {
    setExpiresAt(nextExpiresAt);
    setNow(new Date());
  };

  const stop = () => setExpiresAt(null);

  return {
    isRunning: expiresAt !== null,
    isExpired: expiresAt !== null && remainingSeconds === 0,
    remainingTimeLabel: formatRemainingTime(remainingSeconds),
    start,
    stop,
  };
};

export default useVerificationTimer;

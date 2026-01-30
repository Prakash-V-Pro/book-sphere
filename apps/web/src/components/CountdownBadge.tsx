import { useEffect, useState } from "react";

interface CountdownBadgeProps {
  opensAt: string;
}

export function CountdownBadge({ opensAt }: CountdownBadgeProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(opensAt).getTime();
    const timer = setInterval(() => {
      const diff = Math.floor((target - Date.now()) / 1000);
      if (diff <= 9 && diff > 0) {
        setSecondsLeft(diff);
      } else if (diff <= 0) {
        setSecondsLeft(0);
      } else {
        setSecondsLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [opensAt]);

  if (secondsLeft === null) {
    return null;
  }

  if (secondsLeft === 0) {
    return <span className="badge badge-brand">Booking open</span>;
  }

  return <span className="badge badge-muted">Opens in {secondsLeft}s</span>;
}


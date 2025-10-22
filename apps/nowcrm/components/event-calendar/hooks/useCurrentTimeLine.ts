import { useEffect, useState } from 'react';
// Current time line for week and day view
export const useCurrentTimeLine = () => {
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);

  useEffect(() => {
    const updateCurrentTimeLine = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const top = minutes * (16 / 15);
      setCurrentTimeTop(top);
    };

    updateCurrentTimeLine();
    const interval = setInterval(updateCurrentTimeLine, 60000);

    return () => clearInterval(interval);
  }, []);

  return currentTimeTop;
};

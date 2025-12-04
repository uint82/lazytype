import { useState, useEffect, useRef } from "react";

const useSessionTracking = (isTestActive, isTestComplete, timeElapsed) => {
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  const previousIsTestCompleteRef = useRef(false);
  const lastCompletedTimeRef = useRef(0);

  useEffect(() => {
    const wasNotComplete = !previousIsTestCompleteRef.current;
    const isNowComplete = isTestComplete;

    if (wasNotComplete && isNowComplete) {
      lastCompletedTimeRef.current = timeElapsed;
      setAccumulatedTime((prev) => prev + timeElapsed);
    }

    previousIsTestCompleteRef.current = isTestComplete;
  }, [isTestComplete, timeElapsed]);

  useEffect(() => {
    if (isTestComplete) {
      setCurrentSessionTime(accumulatedTime);
    } else {
      setCurrentSessionTime(accumulatedTime);
    }
  }, [isTestComplete, accumulatedTime]);

  return {
    sessionTime: currentSessionTime,
  };
};

export default useSessionTracking;

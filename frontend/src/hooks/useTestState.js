import { useState, useEffect, useRef } from "react";

export default function useTestState(selectedMode, selectedDuration, words) {
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startTimestampRef = useRef(null);
  const rafRef = useRef(null);
  const targetDurationRef = useRef(null);

  useEffect(() => {
    if (words) {
      const wordCount = words
        .trim()
        .split(" ")
        .filter((w) => w.length > 0).length;
      setTotalWords(wordCount);
    }
  }, [words]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const tick = () => {
    if (!startTimestampRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimestampRef.current; // in ms

    let displayElapsed = elapsed;
    if (
      selectedMode === "time" &&
      selectedDuration > 0 &&
      elapsed >= targetDurationRef.current
    ) {
      displayElapsed = targetDurationRef.current;
      setTimeElapsed(displayElapsed);
      completeTest();
      return;
    }

    setTimeElapsed(Math.round(displayElapsed));

    rafRef.current = requestAnimationFrame(tick);
  };

  const startTest = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      setIsTestComplete(false);
      setShowConfig(false);
      setTimeElapsed(0);

      targetDurationRef.current =
        selectedMode === "time" && selectedDuration > 0
          ? selectedDuration * 1000
          : Infinity;

      startTimestampRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const completeTest = () => {
    setIsTestActive(false);
    setIsTestComplete(true);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsTestComplete(false);
    setWordsTyped(0);
    setShowConfig(true);
    setTimeElapsed(0);
    startTimestampRef.current = null;
    targetDurationRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const incrementWordsTyped = () => setWordsTyped((prev) => prev + 1);
  const showConfigOnMouseMove = () =>
    isTestActive && !isTestComplete && setShowConfig(true);
  const hideConfig = () =>
    isTestActive && !isTestComplete && setShowConfig(false);

  return {
    isTestActive,
    isTestComplete,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    startTest,
    incrementWordsTyped,
    completeTest,
    resetTest,
    showConfigOnMouseMove,
    hideConfig,
  };
}

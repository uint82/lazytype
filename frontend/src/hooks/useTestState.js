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
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const tick = () => {
    if (!startTimestampRef.current) return;
    const now = performance.now();
    const elapsed = now - startTimestampRef.current; // in ms
    setTimeElapsed(elapsed);

    if (selectedMode === "time" && elapsed >= selectedDuration * 1000) {
      completeTest();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const startTest = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      setIsTestComplete(false);
      setShowConfig(false);

      startTimestampRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const completeTest = () => {
    setIsTestActive(false);
    setIsTestComplete(true);
    cancelAnimationFrame(rafRef.current);
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsTestComplete(false);
    setWordsTyped(0);
    setShowConfig(true);
    setTimeElapsed(0);
    startTimestampRef.current = null;
    cancelAnimationFrame(rafRef.current);
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

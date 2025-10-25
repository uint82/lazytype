import { useState, useEffect, useRef } from "react";

export default function useTestState(selectedMode, selectedDuration, words) {
  const [isTestActive, setIsTestActive] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerIntervalRef = useRef(null);

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
    setIsTestActive(false);
    setWordsTyped(0);
    setShowConfig(true);
    setTimeElapsed(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [selectedMode, selectedDuration]);

  useEffect(() => {
    if (isTestActive && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTestActive]);

  const startTest = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      setShowConfig(false);
    }
  };

  const showConfigOnMouseMove = () => {
    if (isTestActive) {
      setShowConfig(true);
    }
  };

  const hideConfig = () => {
    if (isTestActive) {
      setShowConfig(false);
    }
  };

  const incrementWordsTyped = () => {
    setWordsTyped((prev) => prev + 1);
  };

  const resetTest = () => {
    setIsTestActive(false);
    setWordsTyped(0);
    setShowConfig(true);
    setTimeElapsed(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  return {
    isTestActive,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    startTest,
    incrementWordsTyped,
    resetTest,
    showConfigOnMouseMove,
    hideConfig,
  };
}

import { useState, useEffect, useRef } from "react";

export default function useTypingStats(
  input,
  words,
  timeElapsed,
  mode = "time",
) {
  const [stats, setStats] = useState({
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    missedChars: 0,
    correctWords: 0,
    incorrectWords: 0,
    wpmHistory: [],
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    currentErrors: 0,
    totalErrors: 0,
  });

  const previousInputRef = useRef("");
  const lastHistoryTimeRef = useRef(0);
  const recordedSecondsRef = useRef(new Set());
  const totalErrorsRef = useRef(0);
  const lastTotalErrorsRef = useRef(0);
  const totalTypedCharsRef = useRef(0);
  const lastTypedCharCountRef = useRef(0);
  const missedCharsRef = useRef(0);
  const processedWordIndexRef = useRef(-1);
  const processedWordErrorRef = useRef(new Set());

  useEffect(() => {
    if ((!input || input.length === 0) && timeElapsed === 0) {
      setStats({
        correctChars: 0,
        incorrectChars: 0,
        extraChars: 0,
        missedChars: 0,
        correctWords: 0,
        incorrectWords: 0,
        wpmHistory: [],
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        currentErrors: 0,
        totalErrors: 0,
      });
      previousInputRef.current = "";
      lastHistoryTimeRef.current = 0;
      recordedSecondsRef.current.clear();
      totalErrorsRef.current = 0;
      lastTotalErrorsRef.current = 0;
      totalTypedCharsRef.current = 0;
      lastTypedCharCountRef.current = 0;
      missedCharsRef.current = 0;
      processedWordIndexRef.current = -1;
      processedWordErrorRef.current.clear();
      return;
    }

    const prevInput = previousInputRef.current;
    const inputWords = input.split(" ");
    const targetWords = words.trim().split(" ");

    if (input.length > prevInput.length) {
      const prevWords = prevInput.split(" ");
      const currWords = input.split(" ");

      if (currWords.length > prevWords.length) {
        const justFinishedWordIndex = prevWords.length - 1;

        if (justFinishedWordIndex > processedWordIndexRef.current) {
          const typedWord = prevWords[justFinishedWordIndex] || "";
          const targetWord = targetWords[justFinishedWordIndex] || "";

          if (typedWord.length < targetWord.length) {
            const missed = targetWord.length - typedWord.length;
            missedCharsRef.current += missed;
          }

          if (
            typedWord !== targetWord &&
            !processedWordErrorRef.current.has(justFinishedWordIndex)
          ) {
            totalErrorsRef.current += 1;
            processedWordErrorRef.current.add(justFinishedWordIndex);
          }

          processedWordIndexRef.current = justFinishedWordIndex;
        }
      }
    }

    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let currentMissedChars = 0;
    let spaces = 0;

    for (let i = 0; i < inputWords.length; i++) {
      const typedWord = inputWords[i];
      const targetWord = targetWords[i] || "";

      const minLen = Math.min(typedWord.length, targetWord.length);
      for (let j = 0; j < minLen; j++) {
        if (typedWord[j] === targetWord[j]) correctChars++;
        else incorrectChars++;
      }

      if (typedWord.length > targetWord.length) {
        extraChars += typedWord.length - targetWord.length;
      }

      if (i < inputWords.length - 1) {
        spaces++;
      }
    }

    let correctWordChars = 0;
    let correctSpaces = 0;

    for (let i = 0; i < inputWords.length; i++) {
      const typedWord = inputWords[i];
      const targetWord = targetWords[i] || "";
      const isLast = i === inputWords.length - 1;
      const lastWordFinished = input.endsWith(" ");

      if (typedWord === targetWord) {
        correctWordChars += targetWord.length;
        if (!isLast || lastWordFinished) {
          correctSpaces++;
        }
      } else if (isLast && !lastWordFinished) {
        if (typedWord.length <= targetWord.length) {
          let hasError = false;
          let correctInWord = 0;

          for (let j = 0; j < typedWord.length; j++) {
            if (typedWord[j] === targetWord[j]) {
              correctInWord++;
            } else {
              hasError = true;
              break;
            }
          }

          if (!hasError) {
            correctWordChars += correctInWord;
          }
        }
      }
    }

    const totalMissedChars = missedCharsRef.current + currentMissedChars;
    const currentErrors = incorrectChars + extraChars;

    let correctWords = 0;
    let incorrectWords = 0;
    inputWords.forEach((typedWord, i) => {
      const targetWord = targetWords[i] || "";
      const isLast = i === inputWords.length - 1;
      const lastWordFinished = input.endsWith(" ");
      if (isLast && !lastWordFinished) return;

      if (typedWord === targetWord) correctWords++;
      else if (typedWord.length > 0 && targetWord.length > 0) incorrectWords++;
    });

    if (input.length > prevInput.length) {
      totalTypedCharsRef.current += input.length - prevInput.length;
    }

    if (input.length > prevInput.length) {
      const prevWords = prevInput.split(" ");
      const currWords = input.split(" ");

      const prevWordCount = prevWords.length;
      const currWordCount = currWords.length;
      const newChars = input.slice(prevInput.length);

      const currentWordIndex = currWordCount - 1;
      const typedWord = currWords[currentWordIndex] || "";
      const targetWord = targetWords[currentWordIndex] || "";

      if (currWordCount > prevWordCount) {
        const finishedWordIndex = prevWordCount - 1;
        const prevWord = prevWords[finishedWordIndex] || "";
        const targetPrevWord = targetWords[finishedWordIndex] || "";

        if (finishedWordIndex > processedWordIndexRef.current) {
          processedWordIndexRef.current = finishedWordIndex;

          if (prevWord.length > targetPrevWord.length) {
            totalErrorsRef.current += prevWord.length - targetPrevWord.length;
          }

          if (prevWord.length < targetPrevWord.length) {
            missedCharsRef.current += targetPrevWord.length - prevWord.length;
          }

          if (
            prevWord !== targetPrevWord &&
            !processedWordErrorRef.current.has(finishedWordIndex)
          ) {
            totalErrorsRef.current += 0;
            processedWordErrorRef.current.add(finishedWordIndex);
          }
        }
      } else {
        for (let j = prevInput.length; j < input.length; j++) {
          const idxInWord =
            typedWord.length - newChars.length + (j - prevInput.length);
          const char = input[j];
          const targetChar = targetWord[idxInWord];

          if (char !== targetChar) totalErrorsRef.current++;
        }
      }
    }

    const timeElapsedInSeconds = timeElapsed / 1000;
    const totalTyped = totalTypedCharsRef.current;
    const totalMistakes = totalErrorsRef.current;
    const totalCorrected = totalTyped - totalMistakes;
    const accuracyExact =
      totalTyped > 0 ? (totalCorrected / totalTyped) * 100 : 100;
    const accuracy = Math.floor(accuracyExact);

    const currentSecond = Math.floor(timeElapsedInSeconds);
    if (currentSecond > lastHistoryTimeRef.current) {
      const newErrorsThisSecond =
        totalErrorsRef.current - lastTotalErrorsRef.current;
      const newTypedCharsThisSecond =
        totalTypedCharsRef.current - lastTypedCharCountRef.current;

      lastTotalErrorsRef.current = totalErrorsRef.current;
      lastTypedCharCountRef.current = totalTypedCharsRef.current;

      const cumulativeNetWpm =
        ((correctWordChars + correctSpaces) *
          (60 / (currentSecond || 0.0001))) /
        5;

      // note: spaces only counts spaces between words, not trailing space
      const allCharsInInput =
        correctChars + incorrectChars + extraChars + spaces;
      const cumulativeRawWpm =
        (allCharsInInput / 5) * (60 / (currentSecond || 0.0001));

      const rawWpmThisSecond = (newTypedCharsThisSecond / 5) * 60;

      const dataPoint = {
        time: currentSecond,
        wpm: Math.round(cumulativeNetWpm),
        rawWpm: Math.round(cumulativeRawWpm),
        burst: Math.round(rawWpmThisSecond),
        wpmExact: cumulativeNetWpm,
        rawWpmExact: cumulativeRawWpm,
        burstExact: rawWpmThisSecond,
        words: inputWords.length,
        errorCount: newErrorsThisSecond > 0 ? newErrorsThisSecond : 0,
      };

      if (!recordedSecondsRef.current.has(currentSecond)) {
        setStats((prev) => ({
          ...prev,
          wpmHistory: [...prev.wpmHistory, dataPoint],
          wpm: dataPoint.wpm,
          wpmExact: dataPoint.wpmExact,
          rawWpm: dataPoint.rawWpm,
          rawWpmExact: dataPoint.rawWpmExact,
        }));
        recordedSecondsRef.current.add(currentSecond);
        lastHistoryTimeRef.current = currentSecond;
      }
    }

    setStats((prev) => {
      const next = {
        ...prev,
        correctChars: correctWordChars + correctSpaces, // Monkeytype style: correctWordChars + correctSpaces
        incorrectChars,
        extraChars,
        missedChars: totalMissedChars,
        correctWords,
        incorrectWords,
        accuracy,
        accuracyExact,
        totalTyped: totalTypedCharsRef.current,
        totalCorrected,
        totalMistakes,
        currentErrors,
        totalErrors: totalErrorsRef.current,
      };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });

    previousInputRef.current = input;
  }, [input, words, timeElapsed, mode, stats.wpmHistory.length, stats.wpm]);

  return stats;
}

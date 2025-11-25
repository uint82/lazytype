import { useState, useEffect, useRef } from "react";

export default function useTypingStats(
  input,
  words,
  timeElapsed,
  mode = "time",
  isFinal = false,
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
    consistency: 100,
  });

  const previousInputRef = useRef("");
  const lastHistoryTimeRef = useRef(0);
  const recordedSecondsRef = useRef(new Set());
  const totalErrorsRef = useRef(0);
  const lastTotalErrorsRef = useRef(0);
  const totalTypedCharsRef = useRef(0);
  const lastTypedCharCountRef = useRef(0);
  const processedWordIndexRef = useRef(-1);
  const processedWordErrorRef = useRef(new Set());

  useEffect(() => {
    if (mode === "zen") {
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
          consistency: 100,
        });
        previousInputRef.current = "";
        lastHistoryTimeRef.current = 0;
        recordedSecondsRef.current.clear();
        totalErrorsRef.current = 0;
        lastTotalErrorsRef.current = 0;
        totalTypedCharsRef.current = 0;
        lastTypedCharCountRef.current = 0;
        processedWordIndexRef.current = -1;
        processedWordErrorRef.current.clear();
        return;
      }

      const prevInput = previousInputRef.current;

      const totalChars = input.length;
      const inputWords = input
        .trim()
        .split(" ")
        .filter((w) => w.length > 0);
      const wordCount = inputWords.length;

      if (input.length > prevInput.length) {
        totalTypedCharsRef.current += input.length - prevInput.length;
      }

      const timeElapsedInSeconds = timeElapsed / 1000;

      const currentSecond = Math.floor(timeElapsedInSeconds);
      if (currentSecond > lastHistoryTimeRef.current) {
        const newTypedCharsThisSecond =
          totalTypedCharsRef.current - lastTypedCharCountRef.current;

        lastTypedCharCountRef.current = totalTypedCharsRef.current;

        const cumulativeWpm =
          (totalChars / 5) * (60 / (currentSecond || 0.0001));

        const burstWpm = (newTypedCharsThisSecond / 5) * 60;

        const dataPoint = {
          time: currentSecond,
          wpm: Math.round(cumulativeWpm),
          rawWpm: Math.round(cumulativeWpm),
          burst: Math.round(burstWpm),
          wpmExact: cumulativeWpm,
          rawWpmExact: cumulativeWpm,
          burstExact: burstWpm,
          words: wordCount,
          errorCount: 0,
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

      if (isFinal) {
        const finalTime = timeElapsedInSeconds;
        const sliceDuration = finalTime - (lastHistoryTimeRef.current || 0);

        const cumulativeWpm = (totalChars / 5) * (60 / (finalTime || 0.0001));

        if (
          !recordedSecondsRef.current.has(finalTime) &&
          sliceDuration >= 0.495
        ) {
          const newCharsSinceLast =
            totalTypedCharsRef.current - lastTypedCharCountRef.current;
          const burstExact = (newCharsSinceLast / 5) * (60 / sliceDuration);

          const dataPoint = {
            time: finalTime,
            wpm: Math.round(cumulativeWpm),
            rawWpm: Math.round(cumulativeWpm),
            burst: Math.round(burstExact),
            wpmExact: cumulativeWpm,
            rawWpmExact: cumulativeWpm,
            burstExact,
            words: wordCount,
            errorCount: 0,
          };

          setStats((prev) => ({
            ...prev,
            wpmHistory: [...prev.wpmHistory, dataPoint],
            wpm: dataPoint.wpm,
            wpmExact: dataPoint.wpmExact,
            rawWpm: dataPoint.rawWpm,
            rawWpmExact: dataPoint.rawWpmExact,
          }));
          recordedSecondsRef.current.add(finalTime);
          lastHistoryTimeRef.current = finalTime;
          lastTypedCharCountRef.current = totalTypedCharsRef.current;
        } else if (!recordedSecondsRef.current.has(finalTime)) {
          setStats((prev) => ({
            ...prev,
            wpm: Math.round(cumulativeWpm),
            wpmExact: cumulativeWpm,
            rawWpm: Math.round(cumulativeWpm),
            rawWpmExact: cumulativeWpm,
          }));
          recordedSecondsRef.current.add(finalTime);
        }
      }

      const calculateConsistency = (wpmHistory) => {
        if (!wpmHistory || wpmHistory.length < 2) return 100;

        const burstWpms = wpmHistory.map(
          (point) => point.burstExact || point.burst,
        );
        const mean =
          burstWpms.reduce((sum, val) => sum + val, 0) / burstWpms.length;

        if (mean === 0) return 100;

        const variance =
          burstWpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
          burstWpms.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;

        return Math.max(0, 100 - cv);
      };

      setStats((prev) => {
        const consistencyValue = calculateConsistency(prev.wpmHistory);
        const next = {
          ...prev,
          correctChars: totalChars,
          incorrectChars: 0,
          extraChars: 0,
          missedChars: 0,
          correctWords: wordCount,
          incorrectWords: 0,
          accuracy: 100,
          accuracyExact: 100,
          totalTyped: totalTypedCharsRef.current,
          totalCorrected: totalTypedCharsRef.current,
          totalMistakes: 0,
          currentErrors: 0,
          totalErrors: 0,
          consistency: Math.round(consistencyValue),
          consistencyExact: consistencyValue,
        };
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
        return next;
      });

      previousInputRef.current = input;
      return;
    }

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
    let spaces = 0;
    let missedChars = 0;

    for (let i = 0; i < inputWords.length; i++) {
      const typedWord = inputWords[i];
      const targetWord = targetWords[i] || "";

      if (typedWord === targetWord) {
        correctChars += targetWord.length;
      } else if (typedWord.length >= targetWord.length) {
        for (let j = 0; j < typedWord.length; j++) {
          if (j < targetWord.length) {
            if (typedWord[j] === targetWord[j]) {
              correctChars++;
            } else {
              incorrectChars++;
            }
          } else {
            extraChars++;
          }
        }
      } else {
        let correct = 0;
        let incorrect = 0;
        let missed = 0;

        for (let j = 0; j < targetWord.length; j++) {
          if (j < typedWord.length) {
            if (typedWord[j] === targetWord[j]) {
              correct++;
            } else {
              incorrect++;
            }
          } else {
            missed++;
          }
        }

        correctChars += correct;
        incorrectChars += incorrect;

        const isLastWord = i === inputWords.length - 1;
        const shouldCountMissed = !isLastWord;

        if (shouldCountMissed) {
          missedChars += missed;
        }
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

      if (typedWord === "" && isLast) {
        continue;
      }

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

    const currentErrors = incorrectChars + extraChars;

    let correctWords = 0;
    let incorrectWords = 0;
    inputWords.forEach((typedWord, i) => {
      const targetWord = targetWords[i] || "";
      const isLast = i === inputWords.length - 1;
      const lastWordFinished = input.endsWith(" ");

      const isAtFinalWordCount = inputWords.length === targetWords.length;
      if (isLast && !lastWordFinished && !isAtFinalWordCount) return;

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
            typedWord.length -
            (input.length - prevInput.length) +
            (j - prevInput.length);
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

    // final snapshot for quote and words mode case when it's >= +0.50s
    if (isFinal) {
      const finalTime = timeElapsedInSeconds;
      const sliceDuration = finalTime - (lastHistoryTimeRef.current || 0);

      const cumulativeNetWpm =
        ((correctWordChars + correctSpaces) * (60 / (finalTime || 0.0001))) / 5;

      const allCharsInInput =
        correctChars + incorrectChars + extraChars + spaces;
      const cumulativeRawWpm =
        (allCharsInInput / 5) * (60 / (finalTime || 0.0001));

      if (
        !recordedSecondsRef.current.has(finalTime) &&
        sliceDuration >= 0.495
      ) {
        const newErrorsSinceLast =
          totalErrorsRef.current - lastTotalErrorsRef.current;
        const newCharsSinceLast =
          totalTypedCharsRef.current - lastTypedCharCountRef.current;
        const burstExact = (newCharsSinceLast / 5) * (60 / sliceDuration);
        const dataPoint = {
          time: finalTime,
          wpm: Math.round(cumulativeNetWpm),
          rawWpm: Math.round(cumulativeRawWpm),
          burst: Math.round(burstExact),
          wpmExact: cumulativeNetWpm,
          rawWpmExact: cumulativeRawWpm,
          burstExact,
          words: inputWords.length,
          errorCount: newErrorsSinceLast > 0 ? newErrorsSinceLast : 0,
        };
        setStats((prev) => ({
          ...prev,
          wpmHistory: [...prev.wpmHistory, dataPoint],
          wpm: dataPoint.wpm,
          wpmExact: dataPoint.wpmExact,
          rawWpm: dataPoint.rawWpm,
          rawWpmExact: dataPoint.rawWpmExact,
        }));
        recordedSecondsRef.current.add(finalTime);
        lastHistoryTimeRef.current = finalTime;
        lastTotalErrorsRef.current = totalErrorsRef.current;
        lastTypedCharCountRef.current = totalTypedCharsRef.current;
      } else if (!recordedSecondsRef.current.has(finalTime)) {
        setStats((prev) => ({
          ...prev,
          wpm: Math.round(cumulativeNetWpm),
          wpmExact: cumulativeNetWpm,
          rawWpm: Math.round(cumulativeRawWpm),
          rawWpmExact: cumulativeRawWpm,
        }));
        recordedSecondsRef.current.add(finalTime);
      }
    }

    const calculateConsistency = (wpmHistory) => {
      if (!wpmHistory || wpmHistory.length < 2) return 100;

      const burstWpms = wpmHistory.map(
        (point) => point.burstExact || point.burst,
      );
      const mean =
        burstWpms.reduce((sum, val) => sum + val, 0) / burstWpms.length;

      if (mean === 0) return 100;

      const variance =
        burstWpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        burstWpms.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / mean) * 100;

      return Math.max(0, 100 - cv);
    };

    setStats((prev) => {
      const consistencyValue = calculateConsistency(prev.wpmHistory);
      const next = {
        ...prev,
        correctChars: correctWordChars + correctSpaces,
        incorrectChars,
        extraChars,
        missedChars,
        correctWords,
        incorrectWords,
        accuracy,
        accuracyExact,
        totalTyped: totalTypedCharsRef.current,
        totalCorrected,
        totalMistakes,
        currentErrors,
        totalErrors: totalErrorsRef.current,
        consistency: Math.round(consistencyValue),
        consistencyExact: consistencyValue,
      };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });

    previousInputRef.current = input;
  }, [input, words, timeElapsed, mode, isFinal]);

  return stats;
}

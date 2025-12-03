import { useRef, useEffect, useState, useCallback } from "react";
import WordDisplay from "./WordDisplay";
import useTypingDisplay from "../hooks/useWordGenerator/useTypingDisplay";
import useWordProgress from "../hooks/useWordGenerator/useWordProgress";
import useWordCompletion from "../hooks/useWordGenerator/useWordCompletion";

const WordGenerator = ({
  text,
  input,
  isZenMode,
  onWordComplete,
  onDeletedCountChange,
  onCaretPositionChange,
}) => {
  const containerRef = useRef(null);
  const lastLineIndexRef = useRef(-1);
  const [zenDeletedCount, setZenDeletedCount] = useState(0);
  const pendingCaretUpdateRef = useRef(null);

  const progressWithoutDelete = useWordProgress(input, 0);

  const {
    visibleWords: normalVisibleWords,
    caretPosition: normalCaretPosition,
    deletedCount,
    updateLineDelete,
    measureCaret: normalMeasureCaret,
  } = useTypingDisplay(
    text,
    containerRef,
    progressWithoutDelete.currentWordIndex,
    progressWithoutDelete.currentWordInput,
  );

  const { currentWordIndex, currentWordInput, adjustedInputWords } =
    useWordProgress(input, deletedCount);

  useWordCompletion(input, isZenMode ? null : onWordComplete, {
    currentWordIndex,
    currentWordInput,
    updateLineDelete,
    measureCaret: normalMeasureCaret,
    containerRef,
    text,
    deletedCount,
  });

  const [zenVisibleWords, setZenVisibleWords] = useState([]);

  useEffect(() => {
    if (isZenMode) {
      if (!input || input.trim() === "") {
        setZenVisibleWords([]);
        return;
      }

      const allWords = input
        .split(" ")
        .filter((word) => word !== "")
        .map((word, idx) => ({
          word: word,
          id: `zen-${idx + zenDeletedCount}`,
        }));

      setZenVisibleWords(allWords.slice(zenDeletedCount));
    }
  }, [isZenMode, input, zenDeletedCount]);

  const checkAndDeleteLine = useCallback(() => {
    if (!isZenMode || !containerRef.current) return false;

    const container = containerRef.current;
    const wordElements = container.querySelectorAll(".word");

    if (wordElements.length === 0) return false;

    const lastWordElement = wordElements[wordElements.length - 1];
    if (!lastWordElement) return false;

    const lineTops = new Map();
    const elementToLine = new Map();

    wordElements.forEach((el, index) => {
      const top = Math.round(el.getBoundingClientRect().top);
      if (!lineTops.has(top)) {
        lineTops.set(top, lineTops.size);
      }
      elementToLine.set(index, lineTops.get(top));
    });

    const lastWordIndex = wordElements.length - 1;
    const lineIndex = elementToLine.get(lastWordIndex) ?? 0;

    const shouldDelete = lineIndex >= 2 && lineIndex > lastLineIndexRef.current;

    if (shouldDelete) {
      const firstLineTop = Math.round(
        wordElements[0].getBoundingClientRect().top,
      );
      const firstLineWords = Array.from(wordElements).filter(
        (el) => Math.round(el.getBoundingClientRect().top) === firstLineTop,
      );

      const deleteCount = firstLineWords.length;

      if (deleteCount > 0) {
        setZenDeletedCount((prev) => prev + deleteCount);
        lastLineIndexRef.current = 1;
        return true;
      }
    } else {
      lastLineIndexRef.current = Math.max(lineIndex, lastLineIndexRef.current);
    }

    return false;
  }, [isZenMode]);

  useEffect(() => {
    if (!isZenMode) return;

    const rafId = requestAnimationFrame(() => {
      checkAndDeleteLine();
    });

    return () => cancelAnimationFrame(rafId);
  }, [isZenMode, input, checkAndDeleteLine]);

  useEffect(() => {
    if (!isZenMode) return;

    const timeoutId = setTimeout(() => {
      checkAndDeleteLine();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isZenMode, input, checkAndDeleteLine]);

  useEffect(() => {
    if (!isZenMode) return;

    if (pendingCaretUpdateRef.current) {
      cancelAnimationFrame(pendingCaretUpdateRef.current);
    }

    pendingCaretUpdateRef.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!containerRef.current) {
            if (onCaretPositionChange) {
              onCaretPositionChange({ x: 9.6, y: 3.93 });
            }
            return;
          }

          const container = containerRef.current;
          const wordElements = container.querySelectorAll(".word");

          if (wordElements.length === 0 || !input) {
            if (onCaretPositionChange) {
              onCaretPositionChange({ x: 9.6, y: 3.93 });
            }
            return;
          }

          const endsWithSpace = input.endsWith(" ");

          const lastWordElement = wordElements[wordElements.length - 1];
          const letterElements = lastWordElement.querySelectorAll("span");

          if (letterElements.length === 0) {
            if (onCaretPositionChange) {
              onCaretPositionChange({ x: 9.6, y: 3.93 });
            }
            return;
          }

          const lastLetter = letterElements[letterElements.length - 1];
          const containerRect = container.getBoundingClientRect();
          const letterRect = lastLetter.getBoundingClientRect();

          const spaceOffset = endsWithSpace ? 19.2 : 0;
          const x = letterRect.right - containerRect.left + spaceOffset;
          const y = letterRect.top - containerRect.top;

          if (onCaretPositionChange) {
            onCaretPositionChange({ x, y });
          }

          pendingCaretUpdateRef.current = null;
        });
      });
    });

    return () => {
      if (pendingCaretUpdateRef.current) {
        cancelAnimationFrame(pendingCaretUpdateRef.current);
        pendingCaretUpdateRef.current = null;
      }
    };
  }, [isZenMode, input, zenDeletedCount, onCaretPositionChange]);

  const prevInputRef = useRef(input);

  useEffect(() => {
    if (isZenMode) {
      const wasCleared = prevInputRef.current.length > 0 && input.length === 0;

      if (wasCleared) {
        setZenDeletedCount(0);
        lastLineIndexRef.current = -1;
      }
    }

    prevInputRef.current = input;
  }, [isZenMode, input]);

  useEffect(() => {
    if (onDeletedCountChange) {
      onDeletedCountChange(isZenMode ? zenDeletedCount : deletedCount);
    }
  }, [isZenMode, zenDeletedCount, deletedCount, onDeletedCountChange]);

  useEffect(() => {
    if (!isZenMode && onCaretPositionChange) {
      onCaretPositionChange(normalCaretPosition);
    }
  }, [isZenMode, normalCaretPosition, onCaretPositionChange]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{
        height: "156px",
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "2rem",
        lineHeight: "2.2rem",
      }}
    >
      <div className="flex flex-wrap">
        {isZenMode ? (
          zenVisibleWords.length > 0 ? (
            <WordDisplay
              words={zenVisibleWords}
              inputWords={[]}
              currentWordIndex={0}
              currentWordInput=""
              isZenMode={true}
            />
          ) : (
            <div
              style={{
                margin: "0.25em 0.3em",
                color: "var(--text-muted)",
              }}
            >
              {/* placeholder */}
            </div>
          )
        ) : (
          <WordDisplay
            words={normalVisibleWords}
            inputWords={adjustedInputWords}
            currentWordIndex={currentWordIndex - deletedCount}
            currentWordInput={currentWordInput}
            isZenMode={false}
          />
        )}
      </div>
    </div>
  );
};

export default WordGenerator;

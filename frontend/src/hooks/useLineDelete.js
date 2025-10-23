import { useState, useRef, useEffect, useCallback } from "react";

export default function useLineDelete(text) {
  const [visibleWords, setVisibleWords] = useState(() =>
    text.split(" ").map((word, idx) => ({ word, id: idx })),
  );
  const [deletedCount, setDeletedCount] = useState(0);

  const lastLineIndexRef = useRef(-1);
  const nextIdRef = useRef(visibleWords.length);

  useEffect(() => {
    const newWords = text.split(" ");
    const totalWords = newWords.length;
    const currentVisibleCount = visibleWords.length;

    if (totalWords > currentVisibleCount + deletedCount) {
      const wordsToAdd = newWords.slice(currentVisibleCount + deletedCount);
      setVisibleWords((prev) => [
        ...prev,
        ...wordsToAdd.map((word, idx) => ({
          word,
          id: nextIdRef.current + idx,
        })),
      ]);
      nextIdRef.current += wordsToAdd.length;
      return;
    }

    if (totalWords < currentVisibleCount + deletedCount) {
      setVisibleWords(newWords.map((word, idx) => ({ word, id: idx })));
      setDeletedCount(0);
      lastLineIndexRef.current = -1;
      nextIdRef.current = newWords.length;
    }
  }, [text, visibleWords.length, deletedCount]);

  const getLinePositions = useCallback((wordElements) => {
    const lineTops = new Map();
    const elementToLine = new Map();

    wordElements.forEach((el, index) => {
      const top = Math.round(el.getBoundingClientRect().top);

      if (!lineTops.has(top)) {
        lineTops.set(top, lineTops.size);
      }

      elementToLine.set(index, lineTops.get(top));
    });

    return { lineTops, elementToLine };
  }, []);

  const deleteFirstLine = useCallback((wordElements) => {
    if (!wordElements.length) return;

    const firstLineTop = Math.round(
      wordElements[0].getBoundingClientRect().top,
    );
    const firstLineWords = Array.from(wordElements).filter(
      (el) => Math.round(el.getBoundingClientRect().top) === firstLineTop,
    );

    setVisibleWords((prev) => prev.slice(firstLineWords.length));
    setDeletedCount((prev) => prev + firstLineWords.length);
    lastLineIndexRef.current = 1;
  }, []);

  const updateLineDelete = useCallback(
    (containerRef, currentWordIndex) => {
      const container = containerRef?.current;
      if (!container) return { activeWord: null, lineIndex: 0 };

      const wordElements = container.querySelectorAll(".word");
      if (!wordElements.length) return { activeWord: null, lineIndex: 0 };

      const adjustedIndex = currentWordIndex - deletedCount;
      const activeWord = wordElements[adjustedIndex];
      if (!activeWord) return { activeWord: null, lineIndex: 0 };

      const { elementToLine } = getLinePositions(wordElements);
      const lineIndex = elementToLine.get(adjustedIndex) ?? 0;

      const shouldDelete =
        lineIndex >= 2 && lineIndex > lastLineIndexRef.current;

      if (shouldDelete) {
        deleteFirstLine(wordElements);
        return { activeWord, lineIndex: 1 };
      }

      lastLineIndexRef.current = Math.max(lineIndex, lastLineIndexRef.current);
      return { activeWord, lineIndex };
    },
    [deletedCount, getLinePositions, deleteFirstLine],
  );

  return { visibleWords, updateLineDelete, deletedCount };
}

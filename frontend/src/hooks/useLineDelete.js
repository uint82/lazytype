import { useState, useRef, useEffect, useCallback } from "react";
import { tokenizeText } from "../utils/textTokenizer";

let globalWordId = 0;

export default function useLineDelete(text) {
  const [visibleWords, setVisibleWords] = useState(() => {
    const words = tokenizeText(text);
    return words.map((word) => ({ word, id: globalWordId++ }));
  });
  const [deletedCount, setDeletedCount] = useState(0);
  const lastLineIndexRef = useRef(-1);

  useEffect(() => {
    const newWords = tokenizeText(text);
    const totalWords = newWords.length;
    const currentVisibleCount = visibleWords.length;

    if (totalWords > currentVisibleCount + deletedCount) {
      const wordsToAdd = newWords.slice(currentVisibleCount + deletedCount);
      setVisibleWords((prev) => [
        ...prev,
        ...wordsToAdd.map((word) => ({
          word,
          id: globalWordId++,
        })),
      ]);
      return;
    }

    if (totalWords < currentVisibleCount + deletedCount) {
      setVisibleWords(newWords.map((word) => ({ word, id: globalWordId++ })));
      setDeletedCount(0);
      lastLineIndexRef.current = -1;
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

    requestAnimationFrame(() => {
      setVisibleWords((prev) => prev.slice(firstLineWords.length));
      setDeletedCount((prev) => prev + firstLineWords.length);
      lastLineIndexRef.current = 1;
    });
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

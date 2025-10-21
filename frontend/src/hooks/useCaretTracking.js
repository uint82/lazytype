import { useState, useCallback } from "react";

export default function useCaretTracking(containerRef) {
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  const measureCaret = useCallback(
    (activeWord, currentWordInput, hasJumped, lineHeight = 48) => {
      if (!activeWord || !containerRef.current) return;

      const letterElements = activeWord.querySelectorAll("span");
      if (!letterElements.length) return;

      const targetLetter =
        letterElements[currentWordInput.length] ||
        letterElements[letterElements.length - 1];

      const containerRect = containerRef.current.getBoundingClientRect();
      const letterRect = targetLetter.getBoundingClientRect();

      const x =
        currentWordInput.length < letterElements.length
          ? letterRect.left - containerRect.left
          : letterRect.right - containerRect.left;

      const y = hasJumped
        ? letterRect.top - containerRect.top - lineHeight
        : letterRect.top - containerRect.top;

      setCaretPosition({ x, y });
    },
    [containerRef],
  );

  return { caretPosition, measureCaret };
}

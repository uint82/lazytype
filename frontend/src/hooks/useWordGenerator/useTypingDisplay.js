import { useEffect } from "react";
import useLineDelete from "../useLineDelete";
import useCaretTracking from "../useCaretTracking";

export default function useTypingDisplay(
  text,
  containerRef,
  currentWordIndex,
  currentWordInput,
) {
  const { visibleWords, updateLineDelete, deletedCount } = useLineDelete(text);
  const { caretPosition, measureCaret } = useCaretTracking(containerRef);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef?.current;
      if (!container) return;

      const wordElements = container.querySelectorAll(".word");
      const adjustedIndex = currentWordIndex - deletedCount;
      const activeWord = wordElements[adjustedIndex];

      if (activeWord) {
        measureCaret(activeWord, currentWordInput || "", false);

        setTimeout(() => {
          updateLineDelete(containerRef, currentWordIndex);
        }, 0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [
    containerRef,
    currentWordIndex,
    currentWordInput,
    deletedCount,
    measureCaret,
    updateLineDelete,
  ]);

  return {
    visibleWords,
    caretPosition,
    deletedCount,
    updateLineDelete,
    measureCaret,
  };
}

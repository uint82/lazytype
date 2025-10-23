import { useEffect } from "react";

export default function useWordCompletion(
  input,
  onWordComplete,
  {
    currentWordIndex,
    currentWordInput,
    updateLineDelete,
    measureCaret,
    containerRef,
  },
) {
  useEffect(() => {
    const { activeWord } = updateLineDelete(containerRef, currentWordIndex);
    if (activeWord) {
      measureCaret(activeWord, currentWordInput, false);
    }
  }, [
    currentWordIndex,
    currentWordInput,
    updateLineDelete,
    measureCaret,
    containerRef,
  ]);

  useEffect(() => {
    if (input.endsWith(" ")) {
      onWordComplete?.();
    }
  }, [input, onWordComplete]);
}

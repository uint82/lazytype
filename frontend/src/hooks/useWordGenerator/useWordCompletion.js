import { useEffect, useRef } from "react";

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
  const previousWordIndexRef = useRef(-1);
  const previousInputLengthRef = useRef(0);
  const completedWordsRef = useRef(new Set());

  useEffect(() => {
    if (!containerRef?.current) return;

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
    const currentInputLength = input.length;
    const isTypingForward = currentInputLength > previousInputLengthRef.current;
    const hasNotCompletedThisWord = !completedWordsRef.current.has(
      currentWordIndex - 1,
    );

    if (
      currentWordIndex > previousWordIndexRef.current &&
      isTypingForward &&
      input.endsWith(" ") &&
      hasNotCompletedThisWord
    ) {
      const completedWordIndex = currentWordIndex - 1;
      completedWordsRef.current.add(completedWordIndex);
      onWordComplete?.();
    }

    previousWordIndexRef.current = currentWordIndex;
    previousInputLengthRef.current = currentInputLength;
  }, [currentWordIndex, input, onWordComplete]);
}

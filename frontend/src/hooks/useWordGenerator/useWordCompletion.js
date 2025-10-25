import { useEffect, useRef, useMemo } from "react";
import {
  tokenizeText,
  normalizeForComparison,
} from "../../utils/textTokenizer";

export default function useWordCompletion(
  input,
  onWordComplete,
  {
    currentWordIndex,
    currentWordInput,
    updateLineDelete,
    measureCaret,
    containerRef,
    text,
  },
) {
  const previousWordIndexRef = useRef(-1);
  const previousInputLengthRef = useRef(0);
  const completedWordsRef = useRef(new Set());

  const allWords = useMemo(() => {
    return tokenizeText(text);
  }, [text]);

  const normalizedWords = useMemo(() => {
    return allWords.map((word) => normalizeForComparison(word));
  }, [allWords]);

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

    const inputWords = input.split(" ");
    const hasTrailingSpace = input.endsWith(" ");

    if (hasTrailingSpace && isTypingForward) {
      const completedWordIndex = inputWords.length - 2;
      if (
        completedWordIndex >= 0 &&
        !completedWordsRef.current.has(completedWordIndex)
      ) {
        completedWordsRef.current.add(completedWordIndex);
        onWordComplete?.();
      }
    }

    if (!hasTrailingSpace && normalizedWords.length > 0 && isTypingForward) {
      const currentTypingWordIndex = inputWords.length - 1;
      const currentTypingWord = inputWords[currentTypingWordIndex];
      const correctWord = normalizedWords[currentTypingWordIndex];

      const isLastWord = currentTypingWordIndex === normalizedWords.length - 1;
      const isWordCorrect = currentTypingWord === correctWord;
      const hasNotCompletedThisWord = !completedWordsRef.current.has(
        currentTypingWordIndex,
      );

      if (isLastWord && isWordCorrect && hasNotCompletedThisWord) {
        completedWordsRef.current.add(currentTypingWordIndex);
        onWordComplete?.();
      }
    }

    previousWordIndexRef.current = currentWordIndex;
    previousInputLengthRef.current = currentInputLength;
  }, [
    currentWordIndex,
    currentWordInput,
    input,
    onWordComplete,
    normalizedWords,
  ]);

  useEffect(() => {
    if (input === "") {
      completedWordsRef.current.clear();
      previousWordIndexRef.current = -1;
      previousInputLengthRef.current = 0;
    }
  }, [input]);
}

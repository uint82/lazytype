// we don't need this anymore. maybe idk. that's why i left it here and not deleting it
import { useEffect } from "react";
import useLineJump from "./useLineJump";
import useCaretTracking from "./useCaretTracking";
import useTypingState from "./useTypingState";

export default function useCaretManager(text, input, containerRef) {
  const inputWords = input.trim().length ? input.split(" ") : [""];
  const currentWordIndex = inputWords.length - 1;
  const currentWordInput = inputWords[currentWordIndex] || "";

  const { jumpOffset, updateLineJump } = useLineJump(text);
  const { caretPosition, measureCaret } = useCaretTracking(containerRef);
  const isTyping = useTypingState(input);

  useEffect(() => {
    if (!containerRef.current) return;

    const { willJump, lineHeight, activeWord } = updateLineJump(
      containerRef,
      currentWordIndex,
    );
    if (!activeWord) return;

    if (willJump) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          measureCaret(activeWord, currentWordInput, true, lineHeight);
        });
      });
    } else {
      requestAnimationFrame(() => {
        measureCaret(activeWord, currentWordInput, false, lineHeight);
      });
    }
  }, [
    containerRef,
    currentWordIndex,
    currentWordInput,
    input,
    text,
    jumpOffset,
    updateLineJump,
    measureCaret,
  ]);

  return { caretPosition, jumpOffset, isTyping };
}

import { useEffect, useCallback } from "react";
import { getRandomWords } from "../../controllers/words-controller";

export default function useTimeMode(
  selectedMode,
  selectedDuration,
  setQuote,
  setWords,
  setInput,
  inputRef,
) {
  useEffect(() => {
    if (selectedMode !== "time") return;

    const randomWords = getRandomWords(50);
    setQuote({ text: randomWords });
    setWords(randomWords);
    setInput("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [selectedMode, selectedDuration, setInput, setWords, setQuote, inputRef]);

  const handleWordComplete = useCallback(() => {
    if (selectedMode !== "time") return;
    const newWord = getRandomWords(1);
    setWords((prev) => prev + " " + newWord);
  }, [selectedMode, setWords]);

  return { handleWordComplete };
}

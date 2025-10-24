import { useEffect, useCallback, useRef } from "react";
import { getRandomWords } from "../../controllers/words-controller";

export default function useTimeMode(
  selectedMode,
  selectedDuration,
  setQuote,
  setWords,
  setInput,
  inputRef,
) {
  const wordCountRef = useRef(0);

  useEffect(() => {
    if (selectedMode !== "time") return;

    const randomWords = getRandomWords(100);
    setQuote({ text: randomWords });
    setWords(randomWords);
    setInput("");
    wordCountRef.current = randomWords.split(" ").length;

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [selectedMode, selectedDuration, setInput, setWords, setQuote, inputRef]);

  const handleWordComplete = useCallback(() => {
    if (selectedMode !== "time") return;

    const newWord = getRandomWords(1);
    setWords((prev) => prev + " " + newWord);
    wordCountRef.current += 1;
  }, [selectedMode, setWords]);

  return { handleWordComplete };
}

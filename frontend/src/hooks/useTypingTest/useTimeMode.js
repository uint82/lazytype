import { useEffect } from "react";
import { getRandomWords } from "../../controllers/words-controller";

export default function useTimeMode(
  selectedMode,
  selectedDuration,
  setQuote,
  setWords,
  setInput,
  inputRef,
  selectedLanguage = "english",
) {
  useEffect(() => {
    if (selectedMode === "time") {
      const randomWords = getRandomWords(50, selectedLanguage);
      setQuote({ text: randomWords });
      setWords(randomWords);
      setInput("");
      inputRef.current?.focus();
    }
  }, [
    selectedMode,
    selectedDuration,
    selectedLanguage,
    setQuote,
    setWords,
    setInput,
    inputRef,
  ]);

  const handleWordComplete = () => {
    if (selectedMode === "time") {
      const additionalWords = getRandomWords(1, selectedLanguage);
      setWords((prevWords) => prevWords + " " + additionalWords);
    }
  };

  return { handleWordComplete };
}

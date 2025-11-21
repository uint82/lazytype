import { useEffect } from "react";
import { getRandomWords } from "../../controllers/words-controller";

const INITIAL_WORD_COUNT = 100;

export default function useTimeMode(
  selectedMode,
  selectedDuration,
  setQuote,
  setWords,
  setInput,
  inputRef,
  selectedLanguage = "english",
  selectedPunctuation = false,
  selectedNumbers = false,
) {
  useEffect(() => {
    if (selectedMode === "time") {
      const randomWords = getRandomWords(INITIAL_WORD_COUNT, selectedLanguage, {
        punctuation: selectedPunctuation,
        numbers: selectedNumbers,
      });
      setQuote({ text: randomWords });
      setWords(randomWords);
      setInput("");
      inputRef.current?.focus();
    }
  }, [
    selectedMode,
    selectedDuration,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
    setQuote,
    setWords,
    setInput,
    inputRef,
  ]);

  const handleWordComplete = () => {
    if (selectedMode === "time") {
      const additionalWords = getRandomWords(1, selectedLanguage, {
        punctuation: selectedPunctuation,
        numbers: selectedNumbers,
      });
      setWords((prevWords) => prevWords + " " + additionalWords);
    }
  };

  return { handleWordComplete };
}

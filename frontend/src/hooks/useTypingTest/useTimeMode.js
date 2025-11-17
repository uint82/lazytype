import { useEffect, useRef } from "react";
import { getRandomWords } from "../../controllers/words-controller";

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
  shouldAutoFocus = true,
) {
  const shouldAutoFocusRef = useRef(shouldAutoFocus);
  shouldAutoFocusRef.current = shouldAutoFocus;

  useEffect(() => {
    if (selectedMode === "time") {
      const randomWords = getRandomWords(75, selectedLanguage, {
        punctuation: selectedPunctuation,
        numbers: selectedNumbers,
      });

      setQuote({ text: randomWords });
      setWords(randomWords);
      setInput("");

      if (shouldAutoFocusRef.current) {
        inputRef.current?.focus();
      }
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

import { useEffect } from "react";
import { getRandomWords } from "../../controllers/words-controller";

export default function useWordsMode(
  selectedMode,
  selectedWordCount,
  setQuote,
  setWords,
  setInput,
  inputRef,
  selectedLanguage = "english",
  selectedPunctuation = false,
  selectedNumbers = false,
) {
  useEffect(() => {
    if (selectedMode === "words") {
      const randomWords = getRandomWords(selectedWordCount, selectedLanguage, {
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
    selectedWordCount,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
    setQuote,
    setWords,
    setInput,
    inputRef,
  ]);
}

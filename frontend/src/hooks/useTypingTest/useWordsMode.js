import { useEffect } from "react";
import { getRandomWords } from "../../controllers/words-controller";

const INITIAL_WORD_COUNT = 100;

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
  isModalOpen = false,
) {
  useEffect(() => {
    if (selectedMode === "words") {
      const initialCount =
        selectedWordCount === 0
          ? INITIAL_WORD_COUNT
          : Math.min(selectedWordCount, INITIAL_WORD_COUNT);

      const randomWords = getRandomWords(initialCount, selectedLanguage, {
        punctuation: selectedPunctuation,
        numbers: selectedNumbers,
      });
      setQuote({ text: randomWords });
      setWords(randomWords);
      setInput("");

      if (!isModalOpen) {
        inputRef.current?.focus();
      }
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
    isModalOpen,
  ]);

  const handleWordComplete = () => {
    if (selectedMode === "words") {
      setWords((prevWords) => {
        const currentWordArray = prevWords.trim().split(" ");

        if (
          selectedWordCount === 0 ||
          currentWordArray.length < selectedWordCount
        ) {
          const additionalWords = getRandomWords(1, selectedLanguage, {
            punctuation: selectedPunctuation,
            numbers: selectedNumbers,
          });
          return prevWords + " " + additionalWords;
        }

        return prevWords;
      });
    }
  };

  return { handleWordComplete };
}

import { useEffect } from "react";
import { getRandomQuote } from "../../controllers/quotes-controller";

export default function useQuoteMode(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
  selectedLanguage = "english",
) {
  useEffect(() => {
    if (selectedMode === "quotes") {
      const q = getRandomQuote(selectedGroup, selectedLanguage);
      setQuote(q);
      setWords(q.text);
      setInput("");
      inputRef.current?.focus();
    }
  }, [
    selectedMode,
    selectedGroup,
    selectedLanguage,
    setQuote,
    setWords,
    setInput,
    inputRef,
  ]);
}

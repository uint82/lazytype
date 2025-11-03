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
  setActualQuoteGroup,
) {
  useEffect(() => {
    if (selectedMode === "quotes") {
      const { quote, actualGroup } = getRandomQuote(
        selectedGroup,
        selectedLanguage,
      );
      setQuote(quote);
      setWords(quote.text);
      setInput("");
      setActualQuoteGroup(actualGroup);
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
    setActualQuoteGroup,
  ]);
}

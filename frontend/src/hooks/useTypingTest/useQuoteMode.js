import { useEffect, useRef } from "react";
import {
  getRandomQuote,
  getQuoteById,
} from "../../controllers/quotes-controller";

export default function useQuoteMode(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
  selectedLanguage = "english",
  setActualQuoteGroup,
  selectedQuoteId = null,
) {
  const prevQuoteIdRef = useRef(selectedQuoteId);
  const prevModeRef = useRef(selectedMode);

  useEffect(() => {
    if (selectedMode !== "quotes") {
      prevModeRef.current = selectedMode;
      return;
    }

    const justSwitchedToQuotes =
      prevModeRef.current !== "quotes" && selectedMode === "quotes";

    if (selectedQuoteId !== null && justSwitchedToQuotes) {
      const quoteData = getQuoteById(selectedQuoteId, selectedLanguage);
      if (quoteData) {
        setQuote(quoteData);
        setWords(quoteData.text);
        setInput("");
        setActualQuoteGroup(quoteData.group);
        inputRef.current?.focus();
      }
      prevModeRef.current = selectedMode;
      prevQuoteIdRef.current = selectedQuoteId;
      return;
    }

    const quoteIdCleared =
      prevQuoteIdRef.current !== null && selectedQuoteId === null;

    if (selectedQuoteId === null || quoteIdCleared) {
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

    prevQuoteIdRef.current = selectedQuoteId;
    prevModeRef.current = selectedMode;
  }, [
    selectedMode,
    selectedGroup,
    selectedLanguage,
    setQuote,
    setWords,
    setInput,
    inputRef,
    setActualQuoteGroup,
    selectedQuoteId,
  ]);
}

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
  shouldAutoFocus = true,
) {
  const prevQuoteIdRef = useRef(selectedQuoteId);
  const prevModeRef = useRef(selectedMode);
  const prevLanguageRef = useRef(selectedLanguage);

  const focusRequestedRef = useRef(false);

  useEffect(() => {
    if (selectedMode !== "quotes") {
      prevModeRef.current = selectedMode;
      return;
    }

    const justSwitchedToQuotes =
      prevModeRef.current !== "quotes" && selectedMode === "quotes";
    const languageChanged = prevLanguageRef.current !== selectedLanguage;

    if (selectedQuoteId !== null) {
      const quoteData = getQuoteById(selectedQuoteId, selectedLanguage);

      if (languageChanged && selectedGroup === null) {
        if (quoteData) {
          setQuote(quoteData);
          setWords(quoteData.text);
          setInput("");
          setActualQuoteGroup(quoteData.group);
        }
        focusRequestedRef.current = true;

        prevModeRef.current = selectedMode;
        prevQuoteIdRef.current = selectedQuoteId;
        prevLanguageRef.current = selectedLanguage;
        return;
      }

      if (justSwitchedToQuotes) {
        if (quoteData) {
          setQuote(quoteData);
          setWords(quoteData.text);
          setInput("");
          setActualQuoteGroup(quoteData.group);
        }
        focusRequestedRef.current = true;

        prevModeRef.current = selectedMode;
        prevQuoteIdRef.current = selectedQuoteId;
        prevLanguageRef.current = selectedLanguage;
        return;
      }
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
      focusRequestedRef.current = true;
    }

    prevQuoteIdRef.current = selectedQuoteId;
    prevModeRef.current = selectedMode;
    prevLanguageRef.current = selectedLanguage;
  }, [
    selectedMode,
    selectedGroup,
    selectedLanguage,
    selectedQuoteId,
    setQuote,
    setWords,
    setInput,
    inputRef,
    setActualQuoteGroup,
  ]);

  useEffect(() => {
    if (!focusRequestedRef.current) return;

    if (shouldAutoFocus) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }

    focusRequestedRef.current = false;
  }, [
    shouldAutoFocus,
    selectedMode,
    selectedQuoteId,
    selectedLanguage,
    selectedGroup,
    inputRef,
  ]);
}

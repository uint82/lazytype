import { useEffect, useRef } from "react";
import {
  getRandomQuote,
  getQuoteById,
} from "../../controllers/quotes-controller";

const INITIAL_WORD_COUNT = 100;

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
  setFullQuoteText,
  setDisplayedWordCount,
  isModalOpen = false,
) {
  const prevQuoteIdRef = useRef(selectedQuoteId);
  const prevModeRef = useRef(selectedMode);
  const prevLanguageRef = useRef(selectedLanguage);

  useEffect(() => {
    if (selectedMode !== "quotes") {
      prevModeRef.current = selectedMode;
      return;
    }

    const justSwitchedToQuotes =
      prevModeRef.current !== "quotes" && selectedMode === "quotes";
    const languageChanged = prevLanguageRef.current !== selectedLanguage;

    if (selectedQuoteId !== null && languageChanged && selectedGroup === null) {
      const quoteData = getQuoteById(selectedQuoteId, selectedLanguage);
      if (quoteData) {
        setQuote(quoteData);
        setFullQuoteText(quoteData.text);

        const quoteWords = quoteData.text.split(" ");
        if (quoteWords.length > INITIAL_WORD_COUNT) {
          const initialWords = quoteWords
            .slice(0, INITIAL_WORD_COUNT)
            .join(" ");
          setWords(initialWords);
          setDisplayedWordCount(INITIAL_WORD_COUNT);
        } else {
          setWords(quoteData.text);
          setDisplayedWordCount(quoteWords.length);
        }

        setInput("");
        setActualQuoteGroup(quoteData.group);

        if (!isModalOpen) {
          inputRef.current?.focus();
        }
        prevLanguageRef.current = selectedLanguage;
        prevModeRef.current = selectedMode;
        prevQuoteIdRef.current = selectedQuoteId;
      } else {
        prevLanguageRef.current = selectedLanguage;
      }
      return;
    }

    if (selectedQuoteId !== null && justSwitchedToQuotes) {
      const quoteData = getQuoteById(selectedQuoteId, selectedLanguage);
      if (quoteData) {
        setQuote(quoteData);
        setFullQuoteText(quoteData.text);

        const quoteWords = quoteData.text.split(" ");
        if (quoteWords.length > INITIAL_WORD_COUNT) {
          const initialWords = quoteWords
            .slice(0, INITIAL_WORD_COUNT)
            .join(" ");
          setWords(initialWords);
          setDisplayedWordCount(INITIAL_WORD_COUNT);
        } else {
          setWords(quoteData.text);
          setDisplayedWordCount(quoteWords.length);
        }

        setInput("");
        setActualQuoteGroup(quoteData.group);

        if (!isModalOpen) {
          inputRef.current?.focus();
        }
      }
      prevModeRef.current = selectedMode;
      prevQuoteIdRef.current = selectedQuoteId;
      prevLanguageRef.current = selectedLanguage;
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
      setFullQuoteText(quote.text);

      const quoteWords = quote.text.split(" ");
      if (quoteWords.length > INITIAL_WORD_COUNT) {
        const initialWords = quoteWords.slice(0, INITIAL_WORD_COUNT).join(" ");
        setWords(initialWords);
        setDisplayedWordCount(INITIAL_WORD_COUNT);
      } else {
        setWords(quote.text);
        setDisplayedWordCount(quoteWords.length);
      }

      setInput("");
      setActualQuoteGroup(actualGroup);

      if (!isModalOpen) {
        inputRef.current?.focus();
      }
    }

    prevQuoteIdRef.current = selectedQuoteId;
    prevModeRef.current = selectedMode;
    prevLanguageRef.current = selectedLanguage;
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
    setFullQuoteText,
    setDisplayedWordCount,
    isModalOpen,
  ]);
}

import { useEffect } from "react";

export default function useZenMode(
  selectedMode,
  setQuote,
  setWords,
  setInput,
  inputRef,
  setFullQuoteText,
  setDisplayedWordCount,
  isModalOpen = false,
) {
  useEffect(
    () => {
      if (selectedMode === "zen") {
        setQuote({ text: "" });
        setWords("");
        setInput("");
        setFullQuoteText("");
        setDisplayedWordCount(0);

        if (!isModalOpen) {
          inputRef.current?.focus();
        }
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedMode,
      setQuote,
      setWords,
      setInput,
      setFullQuoteText,
      setDisplayedWordCount,
      inputRef,
    ],
  );
}

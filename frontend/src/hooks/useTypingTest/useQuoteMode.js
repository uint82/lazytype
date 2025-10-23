import { useEffect } from "react";
import { getRandomQuote } from "../../controllers/quotes-controller";

export default function useQuoteMode(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
) {
  useEffect(() => {
    if (selectedMode !== "quotes") return;

    const q = getRandomQuote(selectedGroup);
    setQuote(q);
    setWords(q.text);
    setInput("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [selectedMode, selectedGroup, setInput, setQuote, setWords, inputRef]);
}

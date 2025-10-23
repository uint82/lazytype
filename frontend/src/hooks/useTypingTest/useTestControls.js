import { getRandomQuote } from "../../controllers/quotes-controller";
import { getRandomWords } from "../../controllers/words-controller";

export default function useTestControls(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
) {
  const handleInputChange = (e) => setInput(e.target.value);

  const handleNewTest = () => {
    const q =
      selectedMode === "quotes"
        ? getRandomQuote(selectedGroup)
        : { text: getRandomWords(50) };

    setQuote(q);
    setWords(q.text);
    setInput("");
    inputRef.current?.focus();
  };

  return { handleInputChange, handleNewTest };
}

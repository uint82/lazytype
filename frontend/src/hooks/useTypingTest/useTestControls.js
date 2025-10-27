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
  const handleInputChange = (e, words) => {
    const newValue = e.target.value;
    const inputWords = newValue.split(" ");
    const currentWordIndex = inputWords.length - 1;
    const currentWord = inputWords[currentWordIndex] || "";

    const wordsArray =
      typeof words === "string"
        ? words.split(" ")
        : words.map((w) => (typeof w === "string" ? w : w.word));
    const correctWord = wordsArray[currentWordIndex] || "";

    const maxLength = correctWord.length + 19;
    if (currentWord.length > maxLength) {
      return;
    }

    setInput(newValue);
  };

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

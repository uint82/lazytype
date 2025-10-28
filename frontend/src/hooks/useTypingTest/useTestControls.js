import { getRandomQuote } from "../../controllers/quotes-controller";
import { getRandomWords } from "../../controllers/words-controller";

export default function useTestControls(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
  deletedCount = 0,
  selectedLanguage = "english",
) {
  const handleInputChange = (e, words, prevInput = "") => {
    const newValue = e.target.value;
    const inputWords = newValue.split(" ");
    const currentWordIndex = inputWords.length - 1;
    const currentWord = inputWords[currentWordIndex] || "";

    const wordsArray =
      typeof words === "string"
        ? words.split(" ")
        : words.map((w) => (typeof w === "string" ? w : w.word));
    const correctWord = wordsArray[currentWordIndex] || "";

    const isDeleting = newValue.length < prevInput.length;

    if (!isDeleting && currentWord.length > correctWord.length) {
      const adjustedWordIndex = currentWordIndex - deletedCount;
      const activeWordEl = document.querySelector(
        `[data-word-index="${adjustedWordIndex}"].active`,
      );

      if (activeWordEl) {
        const currentLineTop = activeWordEl.offsetTop;

        const measureSpan = document.createElement("span");
        const computedStyle = window.getComputedStyle(
          activeWordEl.querySelector("span") || activeWordEl,
        );
        measureSpan.style.font = computedStyle.font;
        measureSpan.style.letterSpacing = computedStyle.letterSpacing;
        measureSpan.className = "text-red-500";
        measureSpan.textContent = currentWord[currentWord.length - 1] || "M";
        measureSpan.style.visibility = "hidden";

        activeWordEl.appendChild(measureSpan);

        const newLineTop = activeWordEl.offsetTop;

        activeWordEl.removeChild(measureSpan);

        if (newLineTop !== currentLineTop) {
          return;
        }
      }

      const maxLength = correctWord.length + 19;
      if (currentWord.length > maxLength) {
        return;
      }
    }

    setInput(newValue);
  };

  const handleNewTest = () => {
    const q =
      selectedMode === "quotes"
        ? getRandomQuote(selectedGroup, selectedLanguage)
        : { text: getRandomWords(50, selectedLanguage) };

    setQuote(q);
    setWords(q.text);
    setInput("");
    inputRef.current?.focus();
  };

  return { handleInputChange, handleNewTest };
}

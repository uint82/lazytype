import { getRandomQuote } from "../../controllers/quotes-controller";
import { getRandomWords } from "../../controllers/words-controller";

const INITIAL_WORD_COUNT = 100;

export default function useTestControls(
  selectedMode,
  selectedGroup,
  setQuote,
  setWords,
  setInput,
  inputRef,
  deletedCount = 0,
  selectedLanguage = "english",
  setActualQuoteGroup,
  resetTest,
  selectedPunctuation = false,
  selectedNumbers = false,
  selectedWordCount = 25,
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
    if (selectedMode === "quotes") {
      const { quote, actualGroup } = getRandomQuote(
        selectedGroup,
        selectedLanguage,
      );
      setQuote(quote);
      setWords(quote.text);
      setActualQuoteGroup(actualGroup);
    } else if (selectedMode === "words") {
      const initialCount =
        selectedWordCount === 0
          ? INITIAL_WORD_COUNT
          : Math.min(selectedWordCount, INITIAL_WORD_COUNT);

      const q = {
        text: getRandomWords(initialCount, selectedLanguage, {
          punctuation: selectedPunctuation,
          numbers: selectedNumbers,
        }),
      };
      setQuote(q);
      setWords(q.text);
    } else {
      const q = {
        text: getRandomWords(INITIAL_WORD_COUNT, selectedLanguage, {
          punctuation: selectedPunctuation,
          numbers: selectedNumbers,
        }),
      };
      setQuote(q);
      setWords(q.text);
    }

    setInput("");
    inputRef.current?.focus();
  };

  const handleRepeatTest = () => {
    resetTest();
    setInput("");
    inputRef.current?.focus();
  };

  return { handleInputChange, handleNewTest, handleRepeatTest };
}

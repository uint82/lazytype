import { useState, useEffect } from "react";
import useQuoteMode from "./useQuoteMode";
import useTimeMode from "./useTimeMode";
import useWordsMode from "./useWordsMode";
import useTestControls from "./useTestControls";
import useInputRef from "./useInputRef";
import useTestState from "../useTestState";
import useTypingStats from "../useTypingStats";
import { resetWordGenerator } from "../../controllers/words-controller";
import { loadTestConfig, saveTestConfig } from "../../utils/localStorage";

export default function useTypingTest() {
  const savedConfig = loadTestConfig();

  const [quote, setQuote] = useState([]);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(savedConfig.group);
  const [selectedMode, setSelectedMode] = useState(savedConfig.mode);
  const [selectedDuration, setSelectedDuration] = useState(
    savedConfig.duration,
  );
  const [selectedWordCount, setSelectedWordCount] = useState(
    savedConfig.word_count || 25,
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    savedConfig.language,
  );
  const [selectedPunctuation, setSelectedPunctuation] = useState(
    savedConfig.punctuation,
  );
  const [selectedNumbers, setSelectedNumbers] = useState(savedConfig.numbers);
  const [words, setWords] = useState("");
  const [deletedCount, setDeletedCount] = useState(0);
  const [actualQuoteGroup, setActualQuoteGroup] = useState([]);
  const [testId, setTestId] = useState(0);

  const inputRef = useInputRef();

  const {
    isTestActive,
    isTestComplete,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    startTest,
    incrementWordsTyped,
    completeTest,
    resetTest,
    showConfigOnMouseMove,
    hideConfig,
  } = useTestState(selectedMode, selectedDuration, words);

  const stats = useTypingStats(
    input,
    words,
    timeElapsed,
    selectedMode,
    isTestComplete,
  );

  useEffect(() => {
    saveTestConfig({
      mode: selectedMode,
      group: selectedGroup,
      duration: selectedDuration,
      wordCount: selectedWordCount,
      language: selectedLanguage,
      punctuation: selectedPunctuation,
      numbers: selectedNumbers,
    });
  }, [
    selectedMode,
    selectedGroup,
    selectedDuration,
    selectedWordCount,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
  ]);

  useQuoteMode(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
    setActualQuoteGroup,
  );

  useWordsMode(
    selectedMode,
    selectedWordCount,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
  );

  const { handleWordComplete: originalHandleWordComplete } = useTimeMode(
    selectedMode,
    selectedDuration,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
  );

  const {
    handleInputChange: originalHandleInputChange,
    handleNewTest: originalHandleNewTest,
    handleRepeatTest,
  } = useTestControls(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
    deletedCount,
    selectedLanguage,
    setActualQuoteGroup,
    resetTest,
    selectedPunctuation,
    selectedNumbers,
    selectedWordCount,
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isTestComplete) return;
    if (value.length > 0 && !isTestActive) {
      startTest();
    } else if (value.length > 0 && isTestActive) {
      hideConfig();
    }
    originalHandleInputChange(e, words, input);
  };

  const handleWordComplete = () => {
    incrementWordsTyped();
    originalHandleWordComplete();
    if (selectedMode === "quotes" || selectedMode === "words") {
      const inputWords = input
        .trim()
        .split(" ")
        .filter((w) => w.length > 0);
      const targetWords = words.trim().split(" ");
      if (inputWords.length === targetWords.length) {
        setTimeout(() => completeTest(), 10);
      }
    }
  };

  const handleNewTest = () => {
    resetTest();
    setDeletedCount(0);
    resetWordGenerator(selectedLanguage);
    originalHandleNewTest();
    setTestId((prev) => prev + 1);
  };

  return {
    quote,
    input,
    words,
    inputRef,
    selectedGroup,
    setSelectedGroup,
    selectedMode,
    setSelectedMode,
    selectedDuration,
    setSelectedDuration,
    selectedWordCount,
    setSelectedWordCount,
    selectedLanguage,
    setSelectedLanguage,
    selectedPunctuation,
    setSelectedPunctuation,
    selectedNumbers,
    setSelectedNumbers,
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    isInfinityMode: selectedMode === "time",
    isTestActive,
    isTestComplete,
    wordsTyped,
    totalWords,
    showConfig,
    testId,
    timeElapsed,
    showConfigOnMouseMove,
    hideConfig,
    setDeletedCount,
    stats,
    actualQuoteGroup,
    handleRepeatTest,
  };
}

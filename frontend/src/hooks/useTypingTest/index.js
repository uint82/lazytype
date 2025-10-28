import { useState } from "react";
import useQuoteMode from "./useQuoteMode";
import useTimeMode from "./useTimeMode";
import useTestControls from "./useTestControls";
import useInputRef from "./useInputRef";
import useTestState from "../useTestState";

export default function useTypingTest() {
  const [quote, setQuote] = useState(null);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMode, setSelectedMode] = useState("quotes");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [words, setWords] = useState("");
  const [deletedCount, setDeletedCount] = useState(0);
  const inputRef = useInputRef();

  const {
    isTestActive,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    startTest,
    incrementWordsTyped,
    resetTest,
    showConfigOnMouseMove,
    hideConfig,
  } = useTestState(selectedMode, selectedDuration, words);

  useQuoteMode(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
  );

  const { handleWordComplete: originalHandleWordComplete } = useTimeMode(
    selectedMode,
    selectedDuration,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
  );

  const {
    handleInputChange: originalHandleInputChange,
    handleNewTest: originalHandleNewTest,
  } = useTestControls(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
    deletedCount,
    selectedLanguage,
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
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
  };

  const handleNewTest = () => {
    resetTest();
    setDeletedCount(0);
    originalHandleNewTest();
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
    selectedLanguage,
    setSelectedLanguage,
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    isInfinityMode: selectedMode === "time",
    isTestActive,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    showConfigOnMouseMove,
    hideConfig,
    setDeletedCount,
  };
}

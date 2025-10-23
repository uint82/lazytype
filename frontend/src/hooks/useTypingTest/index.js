import { useState } from "react";
import useQuoteMode from "./useQuoteMode";
import useTimeMode from "./useTimeMode";
import useTestControls from "./useTestControls";
import useInputRef from "./useInputRef";

export default function useTypingTest() {
  const [quote, setQuote] = useState(null);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMode, setSelectedMode] = useState("quotes");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [words, setWords] = useState("");

  const inputRef = useInputRef();

  useQuoteMode(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
  );
  const { handleWordComplete } = useTimeMode(
    selectedMode,
    selectedDuration,
    setQuote,
    setWords,
    setInput,
    inputRef,
  );

  const { handleInputChange, handleNewTest } = useTestControls(
    selectedMode,
    selectedGroup,
    setQuote,
    setWords,
    setInput,
    inputRef,
  );

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
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    isInfinityMode: selectedMode === "time",
  };
}

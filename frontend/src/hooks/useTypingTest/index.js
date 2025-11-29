import { useState, useEffect, useCallback, useRef } from "react";
import useQuoteMode from "./useQuoteMode";
import useTimeMode from "./useTimeMode";
import useWordsMode from "./useWordsMode";
import useZenMode from "./useZenMode";
import useTestControls from "./useTestControls";
import useInputRef from "./useInputRef";
import useTestState from "../useTestState";
import useTypingStats from "../useTypingStats";
import { resetWordGenerator } from "../../controllers/words-controller";
import { loadTestConfig, saveTestConfig } from "../../utils/localStorage";
import { getQuoteById } from "../../controllers/quotes-controller";

export default function useTypingTest(addNotification) {
  const savedConfig = loadTestConfig();

  const [quote, setQuote] = useState([]);
  const [input, setInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(savedConfig.group);
  const [selectedMode, setSelectedMode] = useState(savedConfig.mode);
  const [selectedDuration, setSelectedDuration] = useState(
    savedConfig.duration,
  );
  const [selectedWordCount, setSelectedWordCount] = useState(
    savedConfig.word_count ?? 25,
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
  const [selectedQuoteId, setSelectedQuoteId] = useState(
    savedConfig.selectedQuoteId,
  );
  const [fullQuoteText, setFullQuoteText] = useState("");
  const [displayedWordCount, setDisplayedWordCount] = useState(0);

  const [typedHistory, setTypedHistory] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRef = useInputRef(true, !isModalOpen);

  const prevModeRef = useRef(selectedMode);
  const prevPunctuationRef = useRef(selectedPunctuation);
  const prevNumbersRef = useRef(selectedNumbers);
  const prevDurationRef = useRef(selectedDuration);
  const prevWordCountRef = useRef(selectedWordCount);

  useEffect(
    () => {
      const modeChanged =
        prevModeRef.current !== selectedMode &&
        prevModeRef.current !== undefined;
      const punctuationChanged =
        prevPunctuationRef.current !== selectedPunctuation &&
        prevPunctuationRef.current !== undefined;
      const numbersChanged =
        prevNumbersRef.current !== selectedNumbers &&
        prevNumbersRef.current !== undefined;
      const durationChanged =
        prevDurationRef.current !== selectedDuration &&
        prevDurationRef.current !== undefined;
      const wordCountChanged =
        prevWordCountRef.current !== selectedWordCount &&
        prevWordCountRef.current !== undefined;

      if (
        modeChanged ||
        punctuationChanged ||
        numbersChanged ||
        durationChanged ||
        wordCountChanged
      ) {
        if (
          modeChanged ||
          selectedMode === "time" ||
          selectedMode === "words"
        ) {
          handleNewTest(true);
        }
      }

      prevModeRef.current = selectedMode;
      prevPunctuationRef.current = selectedPunctuation;
      prevNumbersRef.current = selectedNumbers;
      prevDurationRef.current = selectedDuration;
      prevWordCountRef.current = selectedWordCount;
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedMode,
      selectedPunctuation,
      selectedNumbers,
      selectedDuration,
      selectedWordCount,
    ],
  );

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
    if (
      selectedMode === "quotes" &&
      selectedQuoteId !== null &&
      selectedGroup === null
    ) {
      const quoteData = getQuoteById(selectedQuoteId, selectedLanguage);
      if (!quoteData) {
        setSelectedQuoteId(null);
      }
    }
  }, [selectedLanguage, selectedMode, selectedQuoteId, selectedGroup]);

  useEffect(() => {
    if (savedConfig.selectedQuoteId && savedConfig.mode === "quotes") {
      loadSpecificQuote(savedConfig.selectedQuoteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveTestConfig({
      mode: selectedMode,
      group: selectedGroup,
      duration: selectedDuration,
      wordCount: selectedWordCount,
      language: selectedLanguage,
      punctuation: selectedPunctuation,
      numbers: selectedNumbers,
      selectedQuoteId: selectedGroup === null ? selectedQuoteId : null,
    });
  }, [
    selectedMode,
    selectedGroup,
    selectedDuration,
    selectedWordCount,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
    selectedQuoteId,
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
    selectedQuoteId,
    setFullQuoteText,
    setDisplayedWordCount,
    isModalOpen,
    addNotification,
  );

  const { handleWordComplete: wordsHandleWordComplete } = useWordsMode(
    selectedMode,
    selectedWordCount,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
    isModalOpen,
  );

  const { handleWordComplete: timeHandleWordComplete } = useTimeMode(
    selectedMode,
    selectedDuration,
    setQuote,
    setWords,
    setInput,
    inputRef,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
    isModalOpen,
  );

  useZenMode(
    selectedMode,
    setQuote,
    setWords,
    setInput,
    inputRef,
    setFullQuoteText,
    setDisplayedWordCount,
    isModalOpen,
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
    isModalOpen,
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isTestComplete) return;
    if (value.length > 0 && !isTestActive) {
      startTest();
    } else if (value.length > 0 && isTestActive) {
      hideConfig();
    }

    const currentWordIndex = value.split(" ").length - 1;
    const currentInputWords = value.split(" ");
    const currentWordRaw = currentInputWords[currentWordIndex] || "";

    if (selectedMode === "zen") {
      setTypedHistory((prev) => {
        const prevHistory = prev[currentWordIndex] || "";

        // in zen mode:
        // we only update the history if the current word is LONGER than what we remember.
        // this ensures that if the user types "Hello" and backspaces to "Hell",
        // we remember "Hello" was the peak, allowing us to detect the deletion.
        if (currentWordRaw.length > prevHistory.length) {
          return { ...prev, [currentWordIndex]: currentWordRaw };
        }
        return prev;
      });
    } else {
      const targetWordsArray = words.split(" ");
      const targetWord = targetWordsArray[currentWordIndex] || "";

      setTypedHistory((prev) => {
        const prevHistory = prev[currentWordIndex] || "";

        const wasPrevWrong =
          targetWord &&
          !targetWord.startsWith(prevHistory) &&
          prevHistory.length > 0;
        const isCurrentWrong =
          targetWord && !targetWord.startsWith(currentWordRaw);

        if (wasPrevWrong) {
          if (isCurrentWrong && currentWordRaw.length > prevHistory.length) {
            return { ...prev, [currentWordIndex]: currentWordRaw };
          }
          return prev;
        }

        if (isCurrentWrong || currentWordRaw.length > prevHistory.length) {
          return { ...prev, [currentWordIndex]: currentWordRaw };
        }

        return prev;
      });
    }

    originalHandleInputChange(e, words, input);
  };

  const addNextWord = useCallback(() => {
    if (selectedMode !== "quotes" || !fullQuoteText) return;

    const allQuoteWords = fullQuoteText.split(" ");

    if (displayedWordCount >= allQuoteWords.length) return;

    const nextWord = allQuoteWords[displayedWordCount];
    setWords((prevWords) => prevWords + " " + nextWord);
    setDisplayedWordCount((prev) => prev + 1);
  }, [selectedMode, fullQuoteText, displayedWordCount]);

  const handleWordComplete = () => {
    incrementWordsTyped();
    wordsHandleWordComplete();
    timeHandleWordComplete();

    if (selectedMode === "quotes") {
      addNextWord();
    }

    if (selectedMode === "quotes" || selectedMode === "words") {
      const inputWords = input
        .trim()
        .split(" ")
        .filter((w) => w.length > 0);
      const targetWords = words.trim().split(" ");

      const shouldComplete =
        selectedMode === "quotes"
          ? inputWords.length === targetWords.length
          : selectedWordCount !== 0 && inputWords.length === targetWords.length;

      if (shouldComplete) {
        setTimeout(() => completeTest(), 10);
      }
    }
  };

  const handleNewTest = (clearQuote = true) => {
    resetTest();
    setDeletedCount(0);
    setFullQuoteText("");
    setDisplayedWordCount(0);
    setTypedHistory({});

    if (selectedMode !== "zen") {
      resetWordGenerator(selectedLanguage);
    }

    if (clearQuote && selectedMode === "quotes") {
      setSelectedQuoteId(null);
    }

    originalHandleNewTest();
    setTestId((prev) => prev + 1);
  };

  const loadSpecificQuote = useCallback(
    (quoteId) => {
      if (quoteId === null) {
        setSelectedQuoteId(null);
        setFullQuoteText("");
        setDisplayedWordCount(0);
        resetTest();
        setDeletedCount(0);
        setTestId((prev) => prev + 1);
        setTypedHistory({});

        if (!isModalOpen) {
          inputRef.current?.focus();
        }
        return;
      }

      const quoteData = getQuoteById(quoteId, selectedLanguage);
      if (quoteData) {
        setQuote(quoteData);
        setSelectedQuoteId(quoteId);
        setActualQuoteGroup(quoteData.group);
        setInput("");

        const quoteWords = quoteData.text.split(" ");
        setFullQuoteText(quoteData.text);

        if (quoteWords.length > 100) {
          const initialWords = quoteWords.slice(0, 100).join(" ");
          setWords(initialWords);
          setDisplayedWordCount(100);
        } else {
          setWords(quoteData.text);
          setDisplayedWordCount(quoteWords.length);
        }

        resetTest();
        setDeletedCount(0);
        setTypedHistory({});
        setTestId((prev) => prev + 1);

        if (!isModalOpen) {
          inputRef.current?.focus();
        }
      }
    },
    [selectedLanguage, inputRef, resetTest, isModalOpen],
  );

  const setSelectedGroupWrapper = (group) => {
    if (selectedQuoteId !== null) {
      setSelectedQuoteId(null);
    }
    setSelectedGroup(group);
  };

  const setSelectedModeWrapper = (mode) => {
    setSelectedMode(mode);
  };

  return {
    quote,
    input,
    words,
    inputRef,
    selectedGroup,
    setSelectedGroup: setSelectedGroupWrapper,
    selectedMode,
    setSelectedMode: setSelectedModeWrapper,
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
    selectedQuoteId,
    loadSpecificQuote,
    completeTest,
    fullQuoteText,
    setIsModalOpen,
    typedHistory,
  };
}

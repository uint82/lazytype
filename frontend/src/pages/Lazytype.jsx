import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import WordGenerator from "../components/WordGenerator";
import TestConfig from "../components/TestConfig";
import TestStatus from "../components/TestStatus";
import TestResults from "../components/TestResults";
import Caret from "../components/Carret";
import FocusOverlay from "../components/FocusOverlay";
import useTypingTest from "../hooks/useTypingTest";
import LanguageSelector from "../components/LanguageSelector";
import CapsLockIndicator from "../components/CapsLockIndicator";
import { saveTestConfig } from "../utils/localStorage";
import { getQuotes } from "../controllers/quotes-controller";
import NotificationSystem from "../components/NotificationSystem";

const TRANSITION_DURATION = 100;
const SCROLL_DELAY = 100;
const BLUR_DELAY = 300;

const Lazytype = ({ onShowConfigChange, onTestCompleteChange }) => {
  const typingTestHook = useTypingTest();
  const {
    quote,
    words,
    input,
    inputRef,
    setIsModalOpen,
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
    actualQuoteGroup,
    setSelectedPunctuation,
    selectedPunctuation,
    setSelectedNumbers,
    selectedNumbers,
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    handleRepeatTest,
    isInfinityMode,
    isTestActive,
    isTestComplete,
    wordsTyped,
    totalWords,
    showConfig,
    testId,
    timeElapsed,
    showConfigOnMouseMove,
    setDeletedCount,
    stats,
    selectedQuoteId,
    loadSpecificQuote,
    completeTest,
    fullQuoteText,
    displayedWordCount,
  } = typingTestHook;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayWords, setDisplayWords] = useState(words);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const [quotesData, setQuotesData] = useState([]);
  const [hasScrolledToResults, setHasScrolledToResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  const restartCooldownRef = useRef(false);
  const blurTimeoutRef = useRef(null);
  const typingTestContainerRef = useRef(null);
  const notificationShownRef = useRef(false);
  const prevConfigRef = useRef({
    selectedMode,
    selectedDuration,
    selectedWordCount,
    selectedGroup,
    selectedLanguage,
    selectedQuoteId,
  });
  const prevWordsRef = useRef(words);

  const isTyping = !showConfig;
  const isInSearchMode = useMemo(
    () =>
      selectedMode === "quotes" &&
      selectedQuoteId !== null &&
      selectedGroup === null,
    [selectedMode, selectedQuoteId, selectedGroup],
  );

  const isInInfinityMode = useMemo(
    () =>
      (selectedMode === "time" && selectedDuration === 0) ||
      (selectedMode === "words" && selectedWordCount === 0),
    [selectedMode, selectedDuration, selectedWordCount],
  );

  const currentConfig = useMemo(
    () => ({
      selectedMode,
      selectedDuration,
      selectedWordCount,
      selectedGroup,
      selectedLanguage,
      selectedPunctuation,
      selectedNumbers,
      selectedQuoteId,
    }),
    [
      selectedMode,
      selectedDuration,
      selectedWordCount,
      selectedGroup,
      selectedLanguage,
      selectedPunctuation,
      selectedNumbers,
      selectedQuoteId,
    ],
  );
  const isActivelyTyping = isTestActive && !isTestComplete && input.length > 0;

  const scrollToTypingTest = useCallback(() => {
    if (typingTestContainerRef.current) {
      typingTestContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: isTestComplete ? "start" : "center",
      });
    }
  }, [isTestComplete]);

  const clearBlurTimeout = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const performTransition = useCallback(
    (action, scrollAfter = true) => {
      setIsTransitioning(true);
      setTimeout(() => {
        action();
        if (scrollAfter) {
          setTimeout(scrollToTypingTest, SCROLL_DELAY);
        }
        setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
      }, TRANSITION_DURATION);
    },
    [scrollToTypingTest],
  );

  const handleNewTestWithScroll = useCallback(() => {
    setHasScrolledToResults(false);
    if (isInSearchMode) {
      performTransition(() => loadSpecificQuote(selectedQuoteId));
    } else {
      handleNewTest(true);
      setTimeout(scrollToTypingTest, SCROLL_DELAY);
    }
  }, [
    isInSearchMode,
    selectedQuoteId,
    loadSpecificQuote,
    handleNewTest,
    scrollToTypingTest,
    performTransition,
  ]);

  const handleRestartClick = useCallback(() => {
    if (restartCooldownRef.current) return;

    restartCooldownRef.current = true;

    setTimeout(() => {
      restartCooldownRef.current = false;
    }, TRANSITION_DURATION * 3);

    handleNewTestWithScroll();
  }, [handleNewTestWithScroll]);

  const handleRepeatTestWithTransition = useCallback(() => {
    setHasScrolledToResults(false);
    performTransition(() => {
      if (
        selectedMode === "quotes" &&
        selectedQuoteId &&
        selectedGroup === null
      ) {
        loadSpecificQuote(selectedQuoteId);
      } else {
        handleRepeatTest();
      }
    });
  }, [
    selectedMode,
    selectedQuoteId,
    selectedGroup,
    loadSpecificQuote,
    handleRepeatTest,
    performTransition,
  ]);

  const handleBlur = useCallback(() => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, BLUR_DELAY);
  }, [clearBlurTimeout]);

  const handleFocus = useCallback(() => {
    clearBlurTimeout();
    setIsFocused(true);

    if (!isTestComplete) {
      scrollToTypingTest();
    }
  }, [clearBlurTimeout, scrollToTypingTest, isTestComplete]);

  const handleSelectSpecificQuote = useCallback(
    (quote) => {
      setSelectedMode("quotes");
      setSelectedGroup(null);
      loadSpecificQuote(quote.id);
      setTimeout(scrollToTypingTest, SCROLL_DELAY);
    },
    [setSelectedMode, setSelectedGroup, loadSpecificQuote, scrollToTypingTest],
  );

  const handleInputClick = useCallback(() => {
    if (!isFocused) {
      inputRef.current?.focus();
      handleFocus();
    }

    if (!isTestComplete) {
      scrollToTypingTest();
    }
  }, [isFocused, inputRef, handleFocus, scrollToTypingTest, isTestComplete]);

  const addNotification = useCallback(
    (message, type = "notice", duration = 10000) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (
        isInInfinityMode &&
        isTestActive &&
        !isTestComplete &&
        (e.key === "Escape" || (e.key === "Enter" && e.shiftKey))
      ) {
        e.preventDefault();
        completeTest();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        return;
      }

      if (e.key === " ") {
        const words = input.split(" ");
        const currentWord = words[words.length - 1];
        if (currentWord.length === 0) {
          e.preventDefault();
          return;
        }
      }

      if (e.key === "Backspace") {
        const quoteWords = displayWords.trim().split(" ");
        const inputWords = input.trim().split(" ");
        const hasTrailingSpace = input.endsWith(" ");
        const currentWordIndex = hasTrailingSpace
          ? inputWords.length
          : inputWords.length - 1;
        const prevWordIndex = currentWordIndex - 1;

        if (prevWordIndex >= 0) {
          const prevInputWord = inputWords[prevWordIndex];
          const correctPrevWord = quoteWords[prevWordIndex];
          const isPrevWordPerfect =
            prevInputWord &&
            correctPrevWord &&
            prevInputWord.length === correctPrevWord.length &&
            prevInputWord.split("").every((c, i) => c === correctPrevWord[i]);
          const caretAtWordBoundary =
            hasTrailingSpace ||
            input.slice(-1) === " " ||
            inputWords.length > quoteWords.length;

          if (isPrevWordPerfect && caretAtWordBoundary) {
            e.preventDefault();
          }
        }
      }
    },
    [
      input,
      displayWords,
      isInInfinityMode,
      isTestActive,
      isTestComplete,
      completeTest,
    ],
  );

  const totalQuoteWords = useMemo(() => {
    if (selectedMode !== "quotes") return 0;

    const textToUse = fullQuoteText || quote?.text || "";

    if (!textToUse) return displayedWordCount || 0;

    return textToUse.split(" ").filter((w) => w.length > 0).length;
  }, [selectedMode, fullQuoteText, quote, displayedWordCount]);

  useEffect(() => {
    if (setIsModalOpen) {
      setIsModalOpen(isAnyModalOpen);
    }
  }, [isAnyModalOpen, setIsModalOpen]);

  useEffect(() => {
    const quotes = getQuotes(selectedLanguage);
    setQuotesData(quotes);
  }, [selectedLanguage]);

  useEffect(() => {
    return clearBlurTimeout;
  }, [clearBlurTimeout]);

  useEffect(() => {
    if (isTestComplete && !hasScrolledToResults) {
      setTimeout(() => {
        if (typingTestContainerRef.current) {
          typingTestContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        setHasScrolledToResults(true);
      }, SCROLL_DELAY);
    }
  }, [isTestComplete, hasScrolledToResults]);

  useEffect(() => {
    const handleResize = () => {
      if (!isTestComplete) {
        setTimeout(scrollToTypingTest, 500);
      }
    };

    window.addEventListener("resize", handleResize);

    if (!isTestComplete) {
      setTimeout(scrollToTypingTest, SCROLL_DELAY);
    }

    if (!showConfig && !isTestComplete) {
      scrollToTypingTest();
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [showConfig, isTestComplete, scrollToTypingTest]);

  useEffect(() => {
    if (isTestComplete) {
      if (!notificationShownRef.current) {
        const testWordCount = displayWords
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length;
        if (testWordCount < 10) {
          addNotification("Test invalid - too short!", "notice");
        }
        notificationShownRef.current = true;
      }
    } else {
      notificationShownRef.current = false;
    }
  }, [isTestComplete, stats, displayWords, addNotification]);

  useEffect(() => {
    onShowConfigChange?.(showConfig);
  }, [showConfig, onShowConfigChange]);

  useEffect(() => {
    onTestCompleteChange?.(isTestComplete);
  }, [isTestComplete, onTestCompleteChange]);

  useEffect(() => {
    saveTestConfig({
      mode: selectedMode,
      group: selectedGroup,
      duration: selectedDuration,
      word_count: selectedWordCount,
      language: selectedLanguage,
      punctuation: selectedPunctuation,
      numbers: selectedNumbers,
      selectedQuoteId: selectedGroup === null ? selectedQuoteId : null,
    });
  }, [
    selectedMode,
    currentConfig,
    selectedGroup,
    selectedQuoteId,
    selectedDuration,
    selectedLanguage,
    selectedWordCount,
    selectedPunctuation,
    selectedNumbers,
  ]);

  useEffect(() => {
    const configChanged = Object.keys(currentConfig).some(
      (key) => prevConfigRef.current[key] !== currentConfig[key],
    );

    if (words !== displayWords && words) {
      const isAddition =
        prevWordsRef.current && words.startsWith(prevWordsRef.current);

      if (configChanged || !isAddition) {
        prevConfigRef.current = currentConfig;
        prevWordsRef.current = words;
        performTransition(() => setDisplayWords(words), false);
      } else {
        setDisplayWords(words);
        prevWordsRef.current = words;
      }
    }
  }, [words, displayWords, currentConfig, performTransition]);

  return (
    <div
      className="flex flex-col w-full h-full"
      onMouseMove={showConfigOnMouseMove}
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
        isTyping={isActivelyTyping}
      />
      {!isTestComplete && (
        <div className="w-full">
          <div className="flex items-center justify-center">
            <div
              className={`transition-opacity duration-100 ${showConfig ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <TestConfig
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                selectedWordCount={selectedWordCount}
                setSelectedWordCount={setSelectedWordCount}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                selectedPunctuation={selectedPunctuation}
                setSelectedPunctuation={setSelectedPunctuation}
                selectedNumbers={selectedNumbers}
                setSelectedNumbers={setSelectedNumbers}
                onNewTest={handleNewTestWithScroll}
                quotes={quotesData}
                onSelectSpecificQuote={handleSelectSpecificQuote}
                selectedQuoteId={selectedQuoteId}
                addNotification={addNotification}
                onModalOpen={() => setIsAnyModalOpen(true)}
                onModalClose={() => setIsAnyModalOpen(false)}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full">
          <div
            className={`transition-opacity ${isTransitioning ? "opacity-0" : "opacity-100"
              }`}
          >
            {!isTestComplete && (
              <>
                <div className="flex justify-center relative">
                  <CapsLockIndicator />
                </div>
                {showConfig ? (
                  <div className="flex justify-center mb-2 relative">
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                    />
                  </div>
                ) : (
                  <div className="flex px-2 content-grid">
                    <TestStatus
                      selectedMode={selectedMode}
                      selectedDuration={selectedDuration}
                      selectedWordCount={selectedWordCount}
                      totalQuoteWords={totalQuoteWords}
                      totalWords={totalWords}
                      wordsTyped={wordsTyped}
                      timeElapsed={timeElapsed}
                    />
                  </div>
                )}
              </>
            )}

            <div
              className="content-grid relative mx-auto text-gray-600 w-full"
              ref={typingTestContainerRef}
            >
              {isTestComplete ? (
                <TestResults
                  stats={stats}
                  timeElapsed={timeElapsed}
                  selectedMode={selectedMode}
                  selectedDuration={selectedDuration}
                  selectedWordCount={selectedWordCount}
                  selectedGroup={selectedGroup}
                  selectedLanguage={selectedLanguage}
                  selectedPunctuation={selectedPunctuation}
                  selectedNumbers={selectedNumbers}
                  actualQuoteGroup={actualQuoteGroup}
                  quote={quote}
                  onNextTest={handleNewTestWithScroll}
                  onRepeatTest={handleRepeatTestWithTransition}
                  onTransitionStart={() => setIsTransitioning(true)}
                  addNotification={addNotification}
                  displayWords={displayWords}
                />
              ) : (
                <>
                  {quote ? (
                    <div className="relative">
                      <FocusOverlay
                        isFocused={isFocused}
                        onClick={handleInputClick}
                      />

                      <Caret
                        key={`caret-${testId}-${selectedMode}-${selectedLanguage}`}
                        x={caretPosition.x}
                        y={caretPosition.y}
                        isTyping={isTyping}
                      />

                      <div
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        onClick={handleInputClick}
                      >
                        <WordGenerator
                          key={`${selectedMode}-${selectedLanguage}-${displayWords.substring(0, 20)}`}
                          text={displayWords}
                          input={input}
                          onWordComplete={handleWordComplete}
                          isInfinityMode={isInfinityMode}
                          onDeletedCountChange={setDeletedCount}
                          onCaretPositionChange={setCaretPosition}
                          showConfig={showConfig}
                        />
                      </div>

                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck={false}
                        onChange={handleInputChange}
                        className="opacity-0 absolute pointer-events-none"
                        autoFocus
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  ) : (
                    <p className="text-[#ebdbb2]">Loading test...</p>
                  )}
                </>
              )}
            </div>

            {!isTestComplete && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleRestartClick}
                  className="px-4 py-2 rounded text-3xl text-gray-600 cursor-pointer hover:text-white transition"
                >
                  ⟳
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lazytype;

import { useState, useEffect, useRef } from "react";
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

const Lazytype = ({ onShowConfigChange, onTestCompleteChange }) => {
  const {
    quote,
    words,
    input,
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
    isTestComplete,
    wordsTyped,
    totalWords,
    showConfig,
    testId,
    timeElapsed,
    showConfigOnMouseMove,
    setDeletedCount,
    stats,
  } = useTypingTest();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayWords, setDisplayWords] = useState(words);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef(null);
  const typingTestContainerRef = useRef(null);
  const prevConfigRef = useRef({
    selectedMode,
    selectedDuration,
    selectedWordCount,
    selectedGroup,
    selectedLanguage,
  });
  const prevWordsRef = useRef(words);

  const handleNewTestWithScroll = () => {
    handleNewTest();
    setTimeout(() => {
      if (typingTestContainerRef.current) {
        typingTestContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleRepeatTestWithTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      handleRepeatTest();

      setTimeout(() => {
        if (typingTestContainerRef.current) {
          typingTestContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 150);
  };

  const handleBlur = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 1000);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const scrollToTypingTest = () => {
      if (typingTestContainerRef.current && !isTestComplete) {
        typingTestContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    const handleResize = () => {
      setTimeout(scrollToTypingTest, 500);
    };

    window.addEventListener("resize", handleResize);

    setTimeout(scrollToTypingTest, 100);

    if (!showConfig && !isTestComplete) {
      scrollToTypingTest();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showConfig, isTestComplete]);

  useEffect(() => {
    if (onShowConfigChange) onShowConfigChange(showConfig);
  }, [showConfig, onShowConfigChange]);

  useEffect(() => {
    if (onTestCompleteChange) onTestCompleteChange(isTestComplete);
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

  useEffect(() => {
    const configChanged =
      prevConfigRef.current.selectedMode !== selectedMode ||
      prevConfigRef.current.selectedDuration !== selectedDuration ||
      prevConfigRef.current.selectedWordCount !== selectedWordCount ||
      prevConfigRef.current.selectedGroup !== selectedGroup ||
      prevConfigRef.current.selectedLanguage !== selectedLanguage ||
      prevConfigRef.current.selectedPunctuation !== selectedPunctuation ||
      prevConfigRef.current.selectedNumbers !== selectedNumbers;

    if (words !== displayWords && words) {
      const isAddition =
        prevWordsRef.current && words.startsWith(prevWordsRef.current);

      if (configChanged || !isAddition) {
        prevConfigRef.current = {
          selectedMode,
          selectedDuration,
          selectedWordCount,
          selectedGroup,
          selectedLanguage,
          selectedPunctuation,
          selectedNumbers,
        };
        prevWordsRef.current = words;
        setIsTransitioning(true);

        setTimeout(() => {
          setDisplayWords(words);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 100);
      } else {
        setDisplayWords(words);
        prevWordsRef.current = words;
      }
    }
  }, [
    words,
    displayWords,
    selectedMode,
    selectedDuration,
    selectedWordCount,
    selectedGroup,
    selectedLanguage,
    selectedPunctuation,
    selectedNumbers,
  ]);

  const isTyping = !showConfig;

  return (
    <div
      className="flex flex-col w-full h-full"
      onMouseMove={showConfigOnMouseMove}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
        rel="stylesheet"
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
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full">
          <div
            className={`transition-opacity duration-100 ${isTransitioning ? "opacity-0" : "opacity-100"
              }`}
          >
            {!isTestComplete && (
              <>
                {showConfig ? (
                  <div className="flex justify-center mb-2 relative">
                    <CapsLockIndicator />
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
                />
              ) : (
                <>
                  {quote ? (
                    <div className="relative">
                      <FocusOverlay
                        isFocused={isFocused}
                        onClick={() => {
                          inputRef.current?.focus();
                          handleFocus();
                        }}
                      />

                      <Caret
                        key={`caret-${testId}-&{selectedMode}-${selectedLanguage}`}
                        x={caretPosition.x}
                        y={caretPosition.y}
                        isTyping={isTyping}
                      />
                      <WordGenerator
                        key={`${selectedMode}-${selectedLanguage}-${displayWords.substring(
                          0,
                          20,
                        )}`}
                        text={displayWords}
                        input={input}
                        onWordComplete={handleWordComplete}
                        isInfinityMode={isInfinityMode}
                        onDeletedCountChange={setDeletedCount}
                        onCaretPositionChange={setCaretPosition}
                        showConfig={showConfig}
                      />
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
                        onKeyDown={(e) => {
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
                            const prevWordIndex = hasTrailingSpace
                              ? currentWordIndex - 1
                              : currentWordIndex - 1;
                            if (prevWordIndex >= 0) {
                              const prevInputWord = inputWords[prevWordIndex];
                              const correctPrevWord = quoteWords[prevWordIndex];
                              const isPrevWordPerfect =
                                prevInputWord &&
                                correctPrevWord &&
                                prevInputWord.length ===
                                correctPrevWord.length &&
                                prevInputWord
                                  .split("")
                                  .every((c, i) => c === correctPrevWord[i]);
                              const caretAtWordBoundary =
                                hasTrailingSpace ||
                                input.slice(-1) === " " ||
                                inputWords.length > quoteWords.length;
                              if (isPrevWordPerfect && caretAtWordBoundary) {
                                e.preventDefault();
                                return;
                              }
                            }
                          }
                        }}
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
                  onClick={handleNewTestWithScroll}
                  className="px-4 py-2 rounded text-2xl text-gray-600 cursor-pointer hover:text-white transition"
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

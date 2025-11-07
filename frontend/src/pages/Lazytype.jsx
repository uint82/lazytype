import { useState, useEffect, useRef } from "react";
import WordGenerator from "../components/WordGenerator";
import TestConfig from "../components/TestConfig";
import TestStatus from "../components/TestStatus";
import TestResults from "../components/TestResults";
import Caret from "../components/Carret";
import useTypingTest from "../hooks/useTypingTest";
import LanguageSelector from "../components/LanguageSelector";

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
    selectedLanguage,
    setSelectedLanguage,
    actualQuoteGroup,
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
  const prevConfigRef = useRef({
    selectedMode,
    selectedDuration,
    selectedGroup,
    selectedLanguage,
  });
  const prevWordsRef = useRef(words);

  const handleRepeatTestWithTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      handleRepeatTest();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  useEffect(() => {
    if (onShowConfigChange) onShowConfigChange(showConfig);
  }, [showConfig, onShowConfigChange]);

  useEffect(() => {
    if (onTestCompleteChange) onTestCompleteChange(isTestComplete);
  }, [isTestComplete, onTestCompleteChange]);

  useEffect(() => {
    const configChanged =
      prevConfigRef.current.selectedMode !== selectedMode ||
      prevConfigRef.current.selectedDuration !== selectedDuration ||
      prevConfigRef.current.selectedGroup !== selectedGroup ||
      prevConfigRef.current.selectedLanguage !== selectedLanguage;

    if (words !== displayWords && words) {
      const isAddition =
        prevWordsRef.current && words.startsWith(prevWordsRef.current);

      if (configChanged || !isAddition) {
        prevConfigRef.current = {
          selectedMode,
          selectedDuration,
          selectedGroup,
          selectedLanguage,
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
    selectedGroup,
    selectedLanguage,
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
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onNewTest={handleNewTest}
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
                  <div className="flex justify-center mb-2">
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                    />
                  </div>
                ) : (
                  <div className="flex typing-test-container mb-2">
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
              className="typing-test-container relative mx-auto text-gray-600 w-full"
              onClick={() => !isTestComplete && inputRef.current?.focus()}
            >
              {isTestComplete ? (
                <TestResults
                  stats={stats}
                  timeElapsed={timeElapsed}
                  selectedMode={selectedMode}
                  selectedDuration={selectedDuration}
                  selectedGroup={selectedGroup}
                  selectedLanguage={selectedLanguage}
                  actualQuoteGroup={actualQuoteGroup}
                  quote={quote}
                  onNextTest={handleNewTest}
                  onRepeatTest={handleRepeatTestWithTransition}
                  onTransitionStart={() => setIsTransitioning(true)}
                />
              ) : (
                <>
                  {quote ? (
                    <>
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
                        onChange={handleInputChange}
                        className="opacity-0 absolute"
                        autoFocus
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
                    </>
                  ) : (
                    <p className="text-[#ebdbb2]">Loading test...</p>
                  )}
                </>
              )}
            </div>

            {!isTestComplete && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleNewTest}
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

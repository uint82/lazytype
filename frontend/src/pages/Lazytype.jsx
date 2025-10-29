import { useState, useEffect, useRef } from "react";
import WordGenerator from "../components/WordGenerator";
import TestConfig from "../components/TestConfig";
import TestStatus from "../components/TestStatus";
import useTypingTest from "../hooks/useTypingTest";

const Lazytype = ({ onShowConfigChange }) => {
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
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    isInfinityMode,
    wordsTyped,
    totalWords,
    showConfig,
    timeElapsed,
    showConfigOnMouseMove,
    setDeletedCount,
  } = useTypingTest();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayWords, setDisplayWords] = useState(words);
  const prevConfigRef = useRef({
    selectedMode,
    selectedDuration,
    selectedGroup,
    selectedLanguage,
  });
  const prevWordsRef = useRef(words);

  useEffect(() => {
    if (onShowConfigChange) onShowConfigChange(showConfig);
  }, [showConfig, onShowConfigChange]);

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
          }, 50);
        }, 150);
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

  return (
    <div
      className="flex flex-col items-center text-center mx-auto w-full"
      onMouseMove={showConfigOnMouseMove}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="relative h-32 w-full flex items-center justify-center">
        <div
          className={`absolute transition-all duration-100 ease-in-out ${showConfig ? "opacity-100" : "opacity-0 pointer-events-none"
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
          />
        </div>

        <div
          className={`absolute transition-all duration-100 ease-in-out ${!showConfig ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <TestStatus
            selectedMode={selectedMode}
            selectedDuration={selectedDuration}
            totalWords={totalWords}
            wordsTyped={wordsTyped}
            timeElapsed={timeElapsed}
          />
        </div>
      </div>

      <div
        className="typing-test-container relative mx-auto text-gray-600 w-full"
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className={`transition-opacity duration-100 ${isTransitioning ? "opacity-0" : "opacity-100"
            }`}
        >
          {quote ? (
            <>
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
              />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="opacity-0 absolute"
                autoFocus
              />
            </>
          ) : (
            <p className="text-[#ebdbb2]">Loading test...</p>
          )}
        </div>
      </div>

      <button
        onClick={handleNewTest}
        className="mt-8 mb-8 px-4 py-2 rounded text-4xl text-gray-600 cursor-pointer hover:text-white transition"
      >
        ⟳
      </button>
    </div>
  );
};

export default Lazytype;

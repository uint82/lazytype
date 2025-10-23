import WordGenerator from "../components/WordGenerator";
import TestConfig from "../components/TestConfig";
import useTypingTest from "../hooks/useTypingTest";

const Lazytype = () => {
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
    handleInputChange,
    handleWordComplete,
    handleNewTest,
    isInfinityMode,
  } = useTypingTest();

  return (
    <div className="flex flex-col items-center text-center mx-auto w-full">
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <TestConfig
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      <div
        style={{
          "--content-max-width": "1736px",
          "--breakout-size":
            "calc((calc(var(--content-max-width) + 12rem) - var(--content-max-width)) / 2)",
        }}
        className="relative mx-auto text-gray-600 w-full max-w-[1736px] px-[var(--breakout-size)]"
        onClick={() => inputRef.current?.focus()}
      >
        {quote ? (
          <>
            <WordGenerator
              key={`${selectedMode}-${words.substring(0, 20)}`}
              text={words}
              input={input}
              onWordComplete={handleWordComplete}
              isInfinityMode={isInfinityMode}
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

      <button
        onClick={handleNewTest}
        className="mt-8 px-4 py-2 rounded text-4xl text-gray-600 cursor-pointer hover:text-white transition"
      >
        ⟳
      </button>
    </div>
  );
};

export default Lazytype;

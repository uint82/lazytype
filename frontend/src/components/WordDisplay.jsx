import { memo } from "react";

const Character = memo(({ char, isCorrect, isTyped, shouldTransition }) => {
  const colorClass = isTyped
    ? isCorrect
      ? "text-white"
      : "text-red-500"
    : "text-[#635851]";

  return (
    <span
      className={`${colorClass} ${shouldTransition ? "transition-colors duration-150" : ""
        }`}
    >
      {char}
    </span>
  );
});

Character.displayName = "Character";

const Word = memo(({ word, isActive, isTyped, userInput }) => {
  const hasError =
    userInput && userInput.split("").some((char, i) => char !== word[i]);

  let wordClass = "word";
  if (isActive) wordClass += " active";
  else if (isTyped && hasError) wordClass += " error-typed";
  else if (isTyped) wordClass += " typed";

  return (
    <div
      className={wordClass}
      style={{
        display: "inline-block",
        margin: "0.25em 0.3em",
      }}
    >
      {word.split("").map((char, charIndex) => {
        const hasInput = userInput && charIndex < userInput.length;
        const isCorrect = hasInput && userInput[charIndex] === char;

        return (
          <Character
            key={charIndex}
            char={char}
            isCorrect={isCorrect}
            isTyped={hasInput}
            shouldTransition={isActive || isTyped}
          />
        );
      })}
    </div>
  );
});

Word.displayName = "Word";

const WordDisplay = ({
  words,
  inputWords,
  currentWordIndex,
  currentWordInput,
}) => {
  return (
    <>
      {words.map((wordObj, wordIndex) => {
        const word = typeof wordObj === "string" ? wordObj : wordObj.word;
        const key = typeof wordObj === "string" ? wordIndex : wordObj.id;
        const isActive = wordIndex === currentWordIndex;
        const isTyped = wordIndex < currentWordIndex;
        const userInput = isActive
          ? currentWordInput
          : isTyped
            ? inputWords[wordIndex]
            : null;

        return (
          <Word
            key={key}
            word={word}
            wordIndex={wordIndex}
            isActive={isActive}
            isTyped={isTyped}
            userInput={userInput}
          />
        );
      })}
    </>
  );
};

export default WordDisplay;

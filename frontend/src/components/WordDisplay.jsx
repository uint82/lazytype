import { memo } from "react";
import { normalizeForComparison } from "../utils/textTokenizer";

const Character = memo(({ char, isCorrect, isTyped, shouldTransition }) => {
  const colorClass = isTyped
    ? isCorrect
      ? "text-[#DBCBA6]"
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

const Word = memo(({ word, wordIndex, isActive, isTyped, userInput }) => {
  const normalizedWord = normalizeForComparison(word);

  const hasError =
    userInput &&
    userInput.split("").some((char, i) => char !== normalizedWord[i]);

  let wordClass = "word";
  if (isActive) wordClass += " active";
  else if (isTyped && hasError) wordClass += " error-typed";
  else if (isTyped) wordClass += " typed";

  const extraChars =
    userInput && userInput.length > word.length
      ? userInput.slice(word.length, word.length + 19)
      : "";

  return (
    <div
      className={wordClass}
      data-word-index={wordIndex}
      style={{
        display: "inline-block",
        margin: "0.25em 0.3em",
      }}
    >
      {word.split("").map((char, charIndex) => {
        const normalizedChar = normalizeForComparison(char);
        const hasInput = userInput && charIndex < userInput.length;
        const isCorrect = hasInput && userInput[charIndex] === normalizedChar;
        return (
          <Character
            key={`${wordIndex}-${charIndex}`}
            char={char}
            isCorrect={isCorrect}
            isTyped={hasInput}
            shouldTransition={isActive || isTyped}
          />
        );
      })}
      {extraChars.split("").map((char, extraIndex) => (
        <Character
          key={`${wordIndex}-extra-${extraIndex}`}
          char={char}
          isCorrect={false}
          isTyped={true}
          shouldTransition={isActive || isTyped}
        />
      ))}
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

import { useRef, useEffect } from "react";
import WordDisplay from "./WordDisplay";

import useTypingDisplay from "../hooks/useWordGenerator/useTypingDisplay";
import useWordProgress from "../hooks/useWordGenerator/useWordProgress";
import useWordCompletion from "../hooks/useWordGenerator/useWordCompletion";

const WordGenerator = ({
  text,
  input,
  onWordComplete,
  onDeletedCountChange,
  onCaretPositionChange,
}) => {
  const containerRef = useRef(null);

  const {
    visibleWords,
    caretPosition,
    deletedCount,
    updateLineDelete,
    measureCaret,
  } = useTypingDisplay(text, containerRef);

  const { currentWordIndex, currentWordInput, adjustedInputWords } =
    useWordProgress(input, deletedCount);

  useEffect(() => {
    if (onDeletedCountChange) {
      onDeletedCountChange(deletedCount);
    }
  }, [deletedCount, onDeletedCountChange]);

  useEffect(() => {
    if (onCaretPositionChange) {
      onCaretPositionChange(caretPosition);
    }
  }, [caretPosition, onCaretPositionChange]);

  useWordCompletion(input, onWordComplete, {
    currentWordIndex,
    currentWordInput,
    updateLineDelete,
    measureCaret,
    containerRef,
    text,
    deletedCount,
  });

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{
        height: "156px",
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "2rem",
        lineHeight: "2rem",
      }}
    >
      <div className="flex flex-wrap">
        <WordDisplay
          words={visibleWords}
          inputWords={adjustedInputWords}
          currentWordIndex={currentWordIndex - deletedCount}
          currentWordInput={currentWordInput}
        />
      </div>
    </div>
  );
};

export default WordGenerator;

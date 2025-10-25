import { useRef } from "react";
import Caret from "./Carret";
import WordDisplay from "./WordDisplay";
import useTypingState from "../hooks/useTypingState";

import useTypingDisplay from "../hooks/useWordGenerator/useTypingDisplay";
import useWordProgress from "../hooks/useWordGenerator/useWordProgress";
import useWordCompletion from "../hooks/useWordGenerator/useWordCompletion";

const WordGenerator = ({ text, input, onWordComplete }) => {
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

  const isTyping = useTypingState(input);

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
      <Caret x={caretPosition.x} y={caretPosition.y} isTyping={isTyping} />

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

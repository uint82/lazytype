import { useRef } from "react";
import Caret from "./Carret";
import WordDisplay from "./WordDisplay";
import useCaretManager from "../hooks/useCaretManager";

const WordGenerator = ({ text, input }) => {
  const containerRef = useRef(null);
  const { caretPosition, jumpOffset, isTyping } = useCaretManager(
    text,
    input,
    containerRef,
  );

  const words = text.split(" ");
  const inputWords = input.trim().length ? input.split(" ") : [""];
  const currentWordIndex = inputWords.length - 1;
  const currentWordInput = inputWords[currentWordIndex] || "";

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: "156px",
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "2rem",
        lineHeight: "2rem",
      }}
    >
      <Caret x={caretPosition.x} y={caretPosition.y} isTyping={isTyping} />

      <div
        className="flex flex-wrap transition-none"
        style={{
          transform: `translateY(-${jumpOffset}px)`,
        }}
      >
        <WordDisplay
          words={words}
          inputWords={inputWords}
          currentWordIndex={currentWordIndex}
          currentWordInput={currentWordInput}
        />
      </div>
    </div>
  );
};

export default WordGenerator;

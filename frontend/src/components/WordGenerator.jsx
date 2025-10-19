import { useRef, useEffect, useState } from "react";

const WordGenerator = ({ text, input }) => {
  const containerRef = useRef(null);
  const lastLineRef = useRef(-1);
  const [jumpOffset, setJumpOffset] = useState(0);

  const words = text.split(" ");
  const inputWords = input.trim().length ? input.split(" ") : [""];
  const currentWordIndex = inputWords.length - 1;
  const currentWordInput = inputWords[currentWordIndex] || "";

  useEffect(() => {
    setJumpOffset(0);
    lastLineRef.current = -1;
  }, [text]);

  useEffect(() => {
    if (!containerRef.current) return;

    const wordElements = containerRef.current.querySelectorAll(".word");
    if (!wordElements.length) return;

    const lineTops = [];
    wordElements.forEach((el) => {
      const top = Math.round(el.getBoundingClientRect().top);
      if (!lineTops.includes(top)) lineTops.push(top);
    });

    const activeWord = wordElements[currentWordIndex];
    if (!activeWord) return;

    const activeTop = Math.round(activeWord.getBoundingClientRect().top);
    const lineIndex = lineTops.indexOf(activeTop);

    if (lineIndex >= 2 && lineIndex > lastLineRef.current) {
      const lineHeight = 48; // adjust if font ever happens to changes (likely not)
      setJumpOffset((prev) => prev + lineHeight);
      lastLineRef.current = lineIndex;
    } else {
      lastLineRef.current = Math.max(lineIndex, lastLineRef.current);
    }
  }, [currentWordIndex, input, text]);

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
      <div
        className="flex flex-wrap transition-none"
        style={{
          transform: `translateY(-${jumpOffset}px)`,
        }}
      >
        {words.map((word, wordIndex) => {
          let wordClass = "word";
          if (wordIndex === currentWordIndex) wordClass = "word active";
          else if (wordIndex < currentWordIndex) wordClass = "word typed";

          return (
            <div
              key={wordIndex}
              className={wordClass}
              style={{
                display: "inline-block",
                marginRight: "0.3em",
                marginLeft: "0.3em",
                marginTop: "0.25em",
                marginBottom: "0.25em",
              }}
            >
              {word.split("").map((char, charIndex) => {
                let letterClass = "";

                if (wordIndex === currentWordIndex) {
                  if (charIndex < currentWordInput.length) {
                    letterClass =
                      currentWordInput[charIndex] === char
                        ? "text-white"
                        : "text-red-500";
                  } else if (charIndex === currentWordInput.length) {
                    letterClass = "border-b-2 border-blue-400";
                  }
                } else if (wordIndex < currentWordIndex) {
                  if (charIndex < (inputWords[wordIndex]?.length || 0)) {
                    letterClass =
                      inputWords[wordIndex][charIndex] === char
                        ? "text-white"
                        : "text-red-500";
                  }
                }

                return (
                  <span
                    key={charIndex}
                    className={`transition-colors ${letterClass}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordGenerator;

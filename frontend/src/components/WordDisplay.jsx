const WordDisplay = ({
  words,
  inputWords,
  currentWordIndex,
  currentWordInput,
}) => {
  return (
    <>
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
    </>
  );
};

export default WordDisplay;

import { useState, useRef, useLayoutEffect } from "react";
import { Copy, Check } from "lucide-react";
import WordHistoryItem from "./WordHistoryItem";

const InputHistory = ({
  wordHistory,
  displayWords,
  addNotification,
  hoveredSecond,
  wordIndicesBySecond,
  isVisible = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCopyHovered, setIsCopyHovered] = useState(false);

  const containerRef = useRef(null);
  const previousVisibility = useRef(isVisible);

  const [containerStyle] = useState(isVisible ? {} : { height: "0px" });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wasVisible = previousVisibility.current;

    if (wasVisible !== isVisible) {
      previousVisibility.current = isVisible;

      setIsAnimating(true);

      if (isVisible) {
        container.style.height = "0px";
        requestAnimationFrame(() => {
          container.style.height = `${container.scrollHeight}px`;
        });
        setTimeout(() => {
          container.style.height = "auto";
          setIsAnimating(false);
        }, 300);
      } else {
        const height = container.scrollHeight;
        container.style.height = `${height}px`;
        requestAnimationFrame(() => {
          container.style.height = "0px";
        });

        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    }
  }, [isVisible]);

  const handleCopyWords = () => {
    const text = displayWords.trim();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);

      addNotification?.("Words copied to clipboard!", "notice", 2000);

      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...containerStyle,
        backgroundColor: "var(--bg-primary)",
      }}
      className={`word-history-container relative full-width mt-2 text-left w-full max-w-full
    transition-all duration-300
    ${isAnimating || !isVisible ? "overflow-hidden" : "overflow-visible"}`}
    >
      {wordHistory.length > 0 && (
        <>
          <div className="flex items-center">
            <h3
              className="text-md transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
            >
              input history
            </h3>
            <button
              tabIndex={-1}
              onClick={handleCopyWords}
              onMouseEnter={() => setIsCopyHovered(true)}
              onMouseLeave={() => setIsCopyHovered(false)}
              aria-label="Copy words list"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors duration-300 text-sm"
              style={{
                color: isCopyHovered
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
              }}
            >
              {copied ? (
                <Check size={16} style={{ color: "var(--text-correct)" }} />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-base leading-relaxed items-start justify-start relative">
            {wordHistory.map((word, index) => (
              <WordHistoryItem
                key={index}
                word={word}
                index={index}
                hoveredSecond={hoveredSecond}
                hoveredWordIndex={hoveredWordIndex}
                setHoveredWordIndex={setHoveredWordIndex}
                wordIndicesBySecond={wordIndicesBySecond}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InputHistory;

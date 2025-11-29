import { useRef, useLayoutEffect, useState } from "react";

const WordHistoryItem = ({
  word,
  index,
  hoveredSecond,
  hoveredWordIndex,
  setHoveredWordIndex,
  wordIndicesBySecond,
}) => {
  const isGraphHighlighted =
    hoveredSecond !== null &&
    wordIndicesBySecond[hoveredSecond]?.includes(index);
  const isWordHovered = hoveredWordIndex === index;
  const isHighlighted = isGraphHighlighted || isWordHovered;
  const highlightedIndices =
    hoveredSecond !== null ? wordIndicesBySecond[hoveredSecond] || [] : [];
  const isFirstInGroup = isGraphHighlighted && highlightedIndices[0] === index;
  const isLastInGroup =
    isGraphHighlighted &&
    highlightedIndices[highlightedIndices.length - 1] === index;
  const showOverlay = isHighlighted && word.tooltip;

  const measureRef = useRef(null);
  const [overlayWidth, setOverlayWidth] = useState(null);

  useLayoutEffect(() => {
    if (measureRef.current && showOverlay) {
      const tooltipWidth = measureRef.current.offsetWidth;
      setOverlayWidth(tooltipWidth);
    }
  }, [showOverlay, word.tooltip, word.target]);

  const getWidthText = () => {
    if (!word.tooltip) return word.target;
    const tooltipLength = word.tooltip.length;
    const targetLength = word.target.length;
    return tooltipLength > targetLength ? word.tooltip : word.target;
  };

  const getRoundingClass = () => {
    if (!isGraphHighlighted) return "rounded-sm";
    if (isFirstInGroup && isLastInGroup) return "rounded-sm";
    if (isFirstInGroup) return "rounded-l-sm";
    if (isLastInGroup) return "rounded-r-sm";
    return "";
  };

  return (
    <span
      onMouseEnter={() => setHoveredWordIndex(index)}
      onMouseLeave={() => setHoveredWordIndex(null)}
      className="relative inline-block cursor-default select-none group"
    >
      <span
        className={`px-1 -mx-1 inline-block ${isHighlighted && !showOverlay
            ? `text-black/70 bg-[#665c54] ${getRoundingClass()}`
            : word.styleClass
          } ${showOverlay ? "opacity-0" : "opacity-100"}`}
      >
        {Array.isArray(word.typed)
          ? word.typed.map((charObj, i) => (
            <span key={i} className={charObj.color}>
              {charObj.char}
            </span>
          ))
          : (word.typed || word.target).split("").map((char, i) => (
            <span key={i} className={word.styleClass}>
              {char}
            </span>
          ))}
      </span>

      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap px-1 -mx-1"
        aria-hidden="true"
      >
        {getWidthText()}
      </span>

      {showOverlay && overlayWidth && (
        <span
          className={`absolute left-0 top-0 whitespace-nowrap px-1 -mx-1 text-black/70 bg-[#665c54] z-10 pointer-events-none ${getRoundingClass()}`}
          style={{ width: `${overlayWidth}px` }}
        >
          {word.tooltip}
        </span>
      )}
    </span>
  );
};
export default WordHistoryItem;

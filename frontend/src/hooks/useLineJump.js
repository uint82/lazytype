import { useState, useRef, useEffect, useCallback } from "react";

export default function useLineJump(text) {
  const [jumpOffset, setJumpOffset] = useState(0);
  const lastLineRef = useRef(-1);

  useEffect(() => {
    setJumpOffset(0);
    lastLineRef.current = -1;
  }, [text]);

  const updateLineJump = useCallback((containerRef, currentWordIndex) => {
    if (!containerRef.current)
      return { willJump: false, lineHeight: 48, lineIndex: 0 };

    const wordElements = containerRef.current.querySelectorAll(".word");
    if (!wordElements.length)
      return { willJump: false, lineHeight: 48, lineIndex: 0 };

    const lineTops = [];
    wordElements.forEach((el) => {
      const top = Math.round(el.getBoundingClientRect().top);
      if (!lineTops.includes(top)) lineTops.push(top);
    });

    const activeWord = wordElements[currentWordIndex];
    if (!activeWord) return { willJump: false, lineHeight: 48, lineIndex: 0 };

    const activeTop = Math.round(activeWord.getBoundingClientRect().top);
    const lineIndex = lineTops.indexOf(activeTop);
    const lineHeight = 48;

    const willJump = lineIndex >= 2 && lineIndex > lastLineRef.current;

    if (willJump) {
      lastLineRef.current = lineIndex;
      setJumpOffset((prev) => prev + lineHeight);
    } else {
      lastLineRef.current = Math.max(lineIndex, lastLineRef.current);
    }

    return { willJump, lineHeight, activeWord };
  }, []);

  return { jumpOffset, updateLineJump };
}

import { useMemo } from "react";

export const useWordHistory = (displayWords, input, typedHistory, mode) => {
  return useMemo(() => {
    const DARK_RED_COLOR = "text-[var(--accuracy-low)]";
    const DARK_GRAY = "text-[var(--text-untyped)]";
    const RED_COLOR = "text-[var(--text-incorrect)]";
    const YELLOW_COLOR = "text-[var(--text-current)]";
    const DEFAULT_COLOR = "text-[var(--text-primary)]";
    const BORDER_RED = "border-b-2 border-[var(--text-incorrect)]/50";
    const BORDER_YELLOW = "border-b-2 border-[var(--text-current)]/50";

    const finalInputWords = input ? input.trim().split(/\s+/) : [];

    if (mode === "zen") {
      return finalInputWords.map((word, index) => {
        const historyWord = typedHistory[index] || word;

        const hasCorrection = historyWord !== word;

        const hasDeletedExtras = historyWord.length > word.length;

        const baseColor = hasCorrection ? YELLOW_COLOR : DEFAULT_COLOR;
        const baseBorder = hasCorrection ? BORDER_YELLOW : "";

        const chars = word.split("").map((char, charIndex) => {
          let charClasses = `${baseColor} ${baseBorder}`;

          // if we deleted characters at the end, mark the last remaining character
          // with a right border to indicate hidden extras
          if (hasDeletedExtras && charIndex === word.length - 1) {
            charClasses += " border-r-2 border-[var(--text-current)]/50";
          }

          return {
            char,
            color: charClasses.trim(),
          };
        });

        return {
          target: word,
          typed: chars,
          styleClass: "",
          tooltip: hasCorrection ? historyWord : word,
          minWidth: word.length,
        };
      });
    }

    const targetWords = displayWords.trim().split(/\s+/);
    const typedCount = finalInputWords.length;
    const displayLimit = typedCount + 2;

    return targetWords.slice(0, displayLimit).map((targetWord, index) => {
      const finalTypedWord = finalInputWords[index] || "";
      const worstTypedWord = typedHistory[index] || finalTypedWord;

      const isPreview = index >= typedCount;
      if (isPreview) {
        return {
          target: targetWord,
          typed: targetWord.split("").map((char) => ({
            char,
            color: DARK_GRAY,
          })),
          styleClass: isPreview ? "pointer-events-none select-none" : "",
          tooltip: null,
          minWidth: targetWord.length,
        };
      }

      const physicallyCorrect = finalTypedWord === targetWord;
      const historyDiffers = worstTypedWord !== finalTypedWord;
      const targetLength = targetWord.length;

      const getCompositeHistory = (typed, target) => {
        if (!typed) return target;
        if (typed.length >= target.length) return typed;
        return typed + target.slice(typed.length);
      };

      let tooltipContent = null;
      const chars = [];

      // correct Word
      if (physicallyCorrect) {
        const hadExtraChars = worstTypedWord.length > targetLength;

        for (let i = 0; i < targetLength; i++) {
          chars.push({
            char: targetWord[i],
            color: historyDiffers
              ? `${YELLOW_COLOR} ${BORDER_YELLOW}`
              : DEFAULT_COLOR,
          });
        }

        tooltipContent = historyDiffers
          ? getCompositeHistory(worstTypedWord, targetWord)
          : finalTypedWord;

        if (historyDiffers && hadExtraChars) {
          chars[targetLength - 1].color += " border-r-2";
        }

        return {
          target: targetWord,
          typed: chars,
          styleClass: "",
          tooltip: tooltipContent,
          minWidth: Math.max(targetWord.length, tooltipContent?.length || 0),
        };
      }

      // incorrect Word
      const actualTypedHistory = finalTypedWord || "Missed word";

      if (finalTypedWord.length > targetLength) {
        for (let i = 0; i < targetLength; i++) {
          chars.push({
            char: targetWord[i],
            color: `${RED_COLOR} ${BORDER_RED}`,
          });
        }
        chars.push({
          char: finalTypedWord[targetLength],
          color: `${DARK_RED_COLOR} ${BORDER_RED}`,
        });
        return {
          target: targetWord,
          typed: chars,
          styleClass: "",
          tooltip: finalTypedWord,
          minWidth: Math.max(targetWord.length, finalTypedWord.length),
        };
      }

      if (finalTypedWord.length < targetLength && finalTypedWord.length > 0) {
        for (let i = 0; i < finalTypedWord.length; i++) {
          chars.push({
            char: targetWord[i],
            color: `${RED_COLOR} ${BORDER_RED}`,
          });
        }
        for (let i = finalTypedWord.length; i < targetLength; i++) {
          chars.push({
            char: targetWord[i],
            color: `${DARK_GRAY} ${BORDER_RED}`,
          });
        }
        return {
          target: targetWord,
          typed: chars,
          styleClass: "",
          tooltip: actualTypedHistory,
          minWidth: targetWord.length,
        };
      }

      if (finalTypedWord.length === 0) {
        for (let i = 0; i < targetLength; i++) {
          chars.push({
            char: targetWord[i],
            color: `${DARK_GRAY} ${BORDER_RED}`,
          });
        }
        return {
          target: targetWord,
          typed: chars,
          styleClass: "",
          tooltip: "Missed word",
          minWidth: targetWord.length,
        };
      }

      for (let i = 0; i < targetLength; i++) {
        const correctChar = finalTypedWord[i] === targetWord[i];
        chars.push({
          char: targetWord[i],
          color: `${correctChar ? DEFAULT_COLOR : RED_COLOR} ${BORDER_RED}`,
        });
      }

      return {
        target: targetWord,
        typed: chars,
        styleClass: "",
        tooltip: finalTypedWord,
        minWidth: targetWord.length,
      };
    });
  }, [displayWords, input, typedHistory, mode]);
};

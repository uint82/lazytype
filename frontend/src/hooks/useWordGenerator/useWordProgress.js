import { useMemo } from "react";

export default function useWordProgress(input, deletedCount) {
  const { inputWords, currentWordIndex, currentWordInput } = useMemo(() => {
    const words = input.trim().length ? input.split(" ") : [""];
    const index = words.length - 1;
    return {
      inputWords: words,
      currentWordIndex: index,
      currentWordInput: words[index] || "",
    };
  }, [input]);

  const adjustedInputWords = useMemo(
    () => inputWords.slice(deletedCount),
    [inputWords, deletedCount],
  );

  return { inputWords, currentWordIndex, currentWordInput, adjustedInputWords };
}

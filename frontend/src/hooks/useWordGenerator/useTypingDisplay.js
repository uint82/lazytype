import useLineDelete from "../useLineDelete";
import useCaretTracking from "../useCaretTracking";

export default function useTypingDisplay(text, containerRef) {
  const { visibleWords, updateLineDelete, deletedCount } = useLineDelete(text);
  const { caretPosition, measureCaret } = useCaretTracking(containerRef);

  return {
    visibleWords,
    caretPosition,
    deletedCount,
    updateLineDelete,
    measureCaret,
  };
}

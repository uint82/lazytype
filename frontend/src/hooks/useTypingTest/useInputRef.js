import { useRef, useEffect } from "react";

export default function useInputRef(autoFocus = true) {
  const inputRef = useRef(null);
  const hasFocusedRef = useRef(false);

  useEffect(() => {
    if (autoFocus && inputRef.current && !hasFocusedRef.current) {
      inputRef.current.focus();
      hasFocusedRef.current = true;
    }
  }, [autoFocus]);

  return inputRef;
}

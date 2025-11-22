import { useRef, useEffect } from "react";

export default function useInputRef(autoFocus = true, shouldFocus = true) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, shouldFocus]);

  return inputRef;
}

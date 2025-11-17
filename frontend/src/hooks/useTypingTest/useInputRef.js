import { useRef, useEffect } from "react";

export default function useInputRef(autoFocus = true) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  return inputRef;
}

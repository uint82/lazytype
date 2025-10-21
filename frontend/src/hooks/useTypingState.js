import { useState, useEffect } from "react";

export default function useTypingState(input) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (input.trim().length === 0) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 600);
    return () => clearTimeout(timeout);
  }, [input]);

  return isTyping;
}

import { useState, useEffect } from "react";

const CapsLockIndicator = () => {
  const [capsLockOn, setCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyEvent = (e) => {
      if (e.getModifierState) {
        const currentState = e.getModifierState("CapsLock");
        setCapsLockOn(currentState);
      }
    };

    window.addEventListener("keydown", handleKeyEvent, true);
    window.addEventListener("keyup", handleKeyEvent, true);

    return () => {
      window.removeEventListener("keydown", handleKeyEvent, true);
      window.removeEventListener("keyup", handleKeyEvent, true);
    };
  }, []);

  if (!capsLockOn) return null;

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2 -top-6 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-colors duration-200"
      style={{
        backgroundColor: "var(--warning)",
        color: "var(--bg-primary)",
      }}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-semibold">Caps Lock is ON</span>
    </div>
  );
};

export default CapsLockIndicator;

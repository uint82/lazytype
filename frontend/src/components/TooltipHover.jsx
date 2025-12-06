import { useState } from "react";

export default function TooltipHover({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute bottom-full mb-2 px-2 py-1 text-[18px] rounded-md shadow-md whitespace-nowrap z-50 border"
          style={{
            color: "var(--text)",
            backgroundColor: "var(--sub-alt)",
            borderColor: "var(--sub-alt)",
            transform: "translateY(-4px)",
            fontFamily: "Roboto Mono, monospace",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

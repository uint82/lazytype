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
            color: "var(--text-primary)",
            backgroundColor:
              "color-mix(in srgb, var(--bg-primary) 95%, transparent)",
            borderColor: "var(--border)",
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

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
          className="absolute bottom-full mb-2 px-2 py-1 text-[18px] text-[#ebdbb2] bg-[#1d2021]/95 border border-[#3c3836] rounded-md shadow-md whitespace-nowrap z-50"
          style={{
            transform: "translateY(-4px)",
            boxShadow: "0 0 4px rgba(0,0,0,0.3), 0 0 6px rgba(184,187,38,0.2)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

import { MousePointerClick } from "lucide-react";

const FocusOverlay = ({ isFocused, onClick }) => {
  if (isFocused) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm rounded cursor-pointer transition-all duration-300 opacity-0 animate-fadeIn"
      onClick={onClick}
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--bg-primary) 10%, transparent)",
        animation: "fadeIn 0.3s ease-in forwards",
      }}
    >
      <p
        className="flex items-center gap-2 text-lg font-medium transform translate-y-4 opacity-0"
        style={{
          fontFamily: "Roboto Mono, monospace",
          color: "var(--secondary)",
          animation: "slideUp 0.5s ease-out 0.1s forwards",
        }}
      >
        <MousePointerClick className="w-5 h-5" />
        Click here to gain focus
      </p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(0px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FocusOverlay;

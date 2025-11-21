import { useState, useEffect, useRef } from "react";

const CustomConfigModal = ({
  mode,
  currentValue,
  onConfirm,
  onClose,
  addNotification,
}) => {
  const [inputValue, setInputValue] = useState(currentValue.toString());
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, []);

  useEffect(() => {
    setInputValue(currentValue.toString());
  }, [currentValue, mode]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 150);
  };

  const parseTimeInput = (input) => {
    if (!input || input.trim() === "" || input === "0") {
      return 0;
    }

    if (input.includes("h") || input.includes("m") || input.includes("s")) {
      let totalSeconds = 0;

      let remaining = input;

      const hoursMatch = input.match(/(\d+)h/);
      if (hoursMatch) {
        totalSeconds += parseInt(hoursMatch[1]) * 3600;
        remaining = remaining.replace(hoursMatch[0], " ");
      }

      const minutesMatch = input.match(/(\d+)m/);
      if (minutesMatch) {
        totalSeconds += parseInt(minutesMatch[1]) * 60;
        remaining = remaining.replace(minutesMatch[0], " ");
      }

      const secondsMatch = input.match(/(\d+)s/);
      if (secondsMatch) {
        totalSeconds += parseInt(secondsMatch[1]);
        remaining = remaining.replace(secondsMatch[0], " ");
      }

      const remainingNumbers = remaining.match(/\d+/g);
      if (remainingNumbers) {
        remainingNumbers.forEach((num) => {
          totalSeconds += parseInt(num);
        });
      }

      return totalSeconds;
    }

    return parseInt(input, 10);
  };

  const formatDuration = (seconds) => {
    if (seconds === 0) return "infinite test";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (secs > 0) parts.push(`${secs} second${secs > 1 ? "s" : ""}`);

    if (parts.length === 0) return "0 seconds";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(" and ");

    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  };

  const handleConfirm = () => {
    if (mode === "time") {
      const value = parseTimeInput(inputValue);
      if (isNaN(value) || value < 0) {
        addNotification(
          "Custom time must be a positive number or zero",
          "notice",
        );
        return;
      }
      if (value === 0) {
        addNotification(
          "Infinite time! Press Esc or Shift+Enter to stop the test.",
          "notice",
        );
      }
      onConfirm(value);
    } else {
      const value = parseInt(inputValue, 10);
      if (isNaN(value) || value < 0) {
        addNotification("Custom word amount must be at least 1", "notice");
        return;
      }
      if (value > 10000) {
        addNotification("Maximum word count is 10,000", "warning");
        return;
      }
      if (value === 0) {
        addNotification(
          "Infinite words! Press Esc or Shift+Enter to stop the test.",
          "notice",
        );
      }
      onConfirm(value);
    }
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const displayDuration =
    mode === "time" ? formatDuration(parseTimeInput(inputValue)) : null;

  const modalTitle = mode === "time" ? "Test Duration" : "Custom Word Amount";
  const placeholder =
    mode === "time" ? "e.g., 45 or 1h30m or 0" : "e.g., 75 or 0";

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-[#282828] rounded-lg w-full max-w-3xl
          border-2
          border-[#504945]
          max-h-[79vh]
          overflow-y-auto
          flex flex-col
          transition-all duration-150 transform
          ${isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
          }
          max-w-[75vw]
          sm:max-w-[500px]
          md:max-w-[500px]
          lg:max-w-[500px]
          mx-auto
          sm:my-auto
          my-4
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 sm:p-9">
          <h2 className="text-lg sm:text-xl font-semibold text-[#ebdbb2] mb-4">
            {modalTitle}
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#d5c4a1] mb-2">
              {displayDuration}
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.select()}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-[#3c3836] text-[#ebdbb2] border border-[#504945] rounded-md focus:outline-none focus:border-[#D8A657] transition-colors text-sm sm:text-base"
              autoFocus
            />

            {mode === "time" && (
              <>
                <p className="text-xs sm:text-sm text-[#a89984] mt-2">
                  You can use "h" for hours and "m" for minutes, for example
                  "1h30m".
                </p>
                <p className="text-xs sm:text-sm text-[#a89984] mt-2">
                  You can start an infinite test by inputting 0. Then, to stop
                  the test, use{" "}
                  <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                    esc
                  </span>{" "}
                  or{" "}
                  <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                    shift
                  </span>{" "}
                  +{" "}
                  <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                    Enter
                  </span>
                </p>
              </>
            )}

            {mode !== "time" && (
              <p className="text-xs sm:text-sm text-[#a89984] mt-2">
                You can start an infinite test by inputting 0. Then, to stop the
                test, use{" "}
                <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                  esc
                </span>{" "}
                or{" "}
                <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                  shift
                </span>{" "}
                +{" "}
                <span className="bg-[#3c3836] text-[#ebdbb2] px-1.5 py-0.5 rounded">
                  Enter
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-md bg-[#D8A657] text-[#282828] hover:bg-[#d9ad6f] transition-colors font-medium text-sm sm:text-base"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomConfigModal;

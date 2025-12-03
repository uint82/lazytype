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
    if (!input || input.trim() === "" || input === "0") return 0;

    if (input.includes("h") || input.includes("m") || input.includes("s")) {
      let total = 0;
      let rest = input;

      const hours = input.match(/(\d+)h/);
      if (hours) {
        total += parseInt(hours[1]) * 3600;
        rest = rest.replace(hours[0], " ");
      }

      const mins = input.match(/(\d+)m/);
      if (mins) {
        total += parseInt(mins[1]) * 60;
        rest = rest.replace(mins[0], " ");
      }

      const secs = input.match(/(\d+)s/);
      if (secs) {
        total += parseInt(secs[1]);
        rest = rest.replace(secs[0], " ");
      }

      const other = rest.match(/\d+/g);
      if (other) {
        other.forEach((num) => (total += parseInt(num)));
      }

      return total;
    }

    return parseInt(input, 10);
  };

  const formatDuration = (seconds) => {
    if (seconds === 0) return "infinite test";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h} hour${h > 1 ? "s" : ""}`);
    if (m > 0) parts.push(`${m} minute${m > 1 ? "s" : ""}`);
    if (s > 0) parts.push(`${s} second${s > 1 ? "s" : ""}`);

    if (parts.length === 0) return "0 seconds";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(" and ");

    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  };

  const handleConfirm = () => {
    if (mode === "time") {
      const val = parseTimeInput(inputValue);
      if (isNaN(val) || val < 0) {
        addNotification(
          "Custom time must be a positive number or zero",
          "notice",
        );
        return;
      }
      if (val === 0) {
        addNotification(
          "Infinite time! Press Esc or Shift+Enter to stop the test.",
          "notice",
        );
      }
      onConfirm(val);
    } else {
      const val = parseInt(inputValue, 10);

      if (isNaN(val) || val < 0) {
        addNotification("Custom word amount must be at least 1", "notice");
        return;
      }
      if (val > 10000) {
        addNotification("Maximum word count is 10,000", "warning");
        return;
      }
      if (val === 0) {
        addNotification(
          "Infinite words! Press Esc or Shift+Enter to stop the test.",
          "notice",
        );
      }
      onConfirm(val);
    }

    handleClose();
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleConfirm();
  const handleBackdropClick = (e) =>
    e.target === e.currentTarget && handleClose();

  const displayDuration =
    mode === "time" ? formatDuration(parseTimeInput(inputValue)) : null;

  const modalTitle = mode === "time" ? "Test Duration" : "Custom Word Amount";
  const placeholder =
    mode === "time" ? "e.g., 45 or 1h30m or 0" : "e.g., 75 or 0";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          rounded-lg w-full max-w-3xl max-h-[79vh]
          border-2 overflow-y-auto flex flex-col
          transition-all duration-150 transform
          mx-auto my-4 sm:my-auto
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-4"}
          max-w-[75vw] sm:max-w-[500px]
        `}
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 sm:p-9">
          <h2
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {modalTitle}
          </h2>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
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
              className="w-full px-3 py-2 rounded-md transition-colors text-sm sm:text-base"
              style={{
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--input-border)",
              }}
              onFocusCapture={(e) =>
                (e.target.style.borderColor = "var(--input-focus)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--input-border)")
              }
              autoFocus
            />

            <p
              className="text-xs sm:text-sm mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              {mode === "time"
                ? `You can use "h" for hours and "m" for minutes, for example "1h30m".`
                : `You can start an infinite test by inputting 0.`}
            </p>

            <p
              className="text-xs sm:text-sm mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              To stop the test, press{" "}
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                esc
              </span>{" "}
              or{" "}
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                shift
              </span>{" "}
              +{" "}
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                Enter
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-colors"
              style={{
                background: "var(--primary)",
                color: "var(--bg-primary)",
              }}
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

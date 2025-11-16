import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const GroupModal = ({
  groups,
  selectedGroup,
  selectedMode,
  selectedDuration,
  selectedWordCount,
  selectedPunctuation,
  selectedNumbers,
  selectedQuoteId,
  onSelectGroup,
  onSelectTime,
  onSelectWords,
  onTogglePunctuation,
  onToggleNumbers,
  onClose,
  onOpenSearchModal,
  inputRef,
}) => {
  const [activeTab, setActiveTab] = useState(selectedMode || "quotes");

  const timeDurations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 0);
  };

  const handleButtonClick = (callback) => {
    callback();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (inputRef?.current) {
          inputRef.current.blur();
        }
      });
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]
      transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-[#282828] p-5 rounded-lg shadow-lg w-[90%] max-w-[320px] text-center
        transition-all duration-150 transform ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <button
              onClick={() =>
                handleButtonClick(() => {
                  setActiveTab("time");
                  onSelectTime(selectedMode === "time" ? selectedDuration : 60);
                })
              }
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "time"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                }`}
            >
              Time
            </button>

            <button
              onClick={() =>
                handleButtonClick(() => {
                  setActiveTab("words");
                  onSelectWords(
                    selectedMode === "words" ? selectedWordCount : 25,
                  );
                })
              }
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "words"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                }`}
            >
              Words
            </button>

            <button
              onClick={() =>
                handleButtonClick(() => {
                  setActiveTab("quotes");
                  onSelectGroup(selectedGroup ?? null);
                })
              }
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "quotes"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                }`}
            >
              Quotes
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {activeTab === "time" ? (
              <>
                {timeDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() =>
                      handleButtonClick(() => onSelectTime(duration))
                    }
                    className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedMode === "time" && selectedDuration === duration
                        ? "bg-[#D8AB19] text-[#282828]"
                        : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                      }`}
                  >
                    {duration}s
                  </button>
                ))}

                <div className="border-t border-[#3c3836] my-2"></div>

                <button
                  onClick={() => handleButtonClick(onTogglePunctuation)}
                  className={`w-full px-4 py-2 rounded text-sm transition-all cursor-pointer ${selectedPunctuation
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  punctuation
                </button>

                <button
                  onClick={() => handleButtonClick(onToggleNumbers)}
                  className={`w-full px-4 py-2 rounded text-sm transition-all cursor-pointer ${selectedNumbers
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  numbers
                </button>
              </>
            ) : activeTab === "words" ? (
              <>
                {wordCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() =>
                      handleButtonClick(() => onSelectWords(count))
                    }
                    className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedMode === "words" && selectedWordCount === count
                        ? "bg-[#D8AB19] text-[#282828]"
                        : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                      }`}
                  >
                    {count}
                  </button>
                ))}

                <div className="border-t border-[#3c3836] my-2"></div>

                <button
                  onClick={() => handleButtonClick(onTogglePunctuation)}
                  className={`w-full px-4 py-2 rounded text-sm transition-all cursor-pointer ${selectedPunctuation
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  punctuation
                </button>

                <button
                  onClick={() => handleButtonClick(onToggleNumbers)}
                  className={`w-full px-4 py-2 rounded text-sm transition-all cursor-pointer ${selectedNumbers
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  numbers
                </button>
              </>
            ) : (
              <>
                {groups.map((group) => (
                  <button
                    key={group.index ?? "all"}
                    onClick={() =>
                      handleButtonClick(() => onSelectGroup(group.index))
                    }
                    className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedMode === "quotes" &&
                        selectedGroup === group.index &&
                        !selectedQuoteId
                        ? "bg-[#D8AB19] text-[#282828]"
                        : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] cursor-pointer"
                      }`}
                  >
                    {group.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    handleClose();
                    onOpenSearchModal();
                  }}
                  className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${selectedQuoteId
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  Search
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GroupModal;

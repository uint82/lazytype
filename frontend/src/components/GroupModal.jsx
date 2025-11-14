import { useState } from "react";
import { createPortal } from "react-dom";

const GroupModal = ({
  groups,
  selectedGroup,
  selectedMode,
  selectedDuration,
  selectedWordCount,
  selectedPunctuation,
  selectedNumbers,
  onSelectGroup,
  onSelectTime,
  onSelectWords,
  onTogglePunctuation,
  onToggleNumbers,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(selectedMode || "quotes");
  const timeDurations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSelectGroup = (groupIndex) => {
    onSelectGroup(groupIndex !== undefined ? groupIndex : null);
  };

  const handleSelectTime = (duration) => {
    onSelectTime(duration || 60);
  };

  const handleSelectWords = (count) => {
    onSelectWords(count || 25);
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#282828] p-5 rounded-lg shadow-lg w-[90%] max-w-[320px] text-center">
        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab("time");
                handleSelectTime(
                  selectedMode === "time" ? selectedDuration : 60,
                );
              }}
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "time"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              Time
            </button>

            <button
              onClick={() => {
                setActiveTab("words");
                handleSelectWords(
                  selectedMode === "words" ? selectedWordCount : 25,
                );
              }}
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "words"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              Words
            </button>

            <button
              onClick={() => {
                setActiveTab("quotes");
                handleSelectGroup(
                  selectedMode === "quotes" ? selectedGroup : null,
                );
              }}
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "quotes"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
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
                    onClick={() => handleSelectTime(duration)}
                    className={`w-full px-4 py-2 rounded text-sm transition-all ${(selectedMode === "time" &&
                        selectedDuration === duration) ||
                        (selectedMode !== "time" && duration === 60)
                        ? "bg-[#D8AB19] text-[#282828]"
                        : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                      }`}
                  >
                    {duration}s
                  </button>
                ))}

                <div className="border-t border-[#3c3836] my-2"></div>

                <button
                  onClick={onTogglePunctuation}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedPunctuation
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  punctuation
                </button>

                <button
                  onClick={onToggleNumbers}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedNumbers
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
                    onClick={() => handleSelectWords(count)}
                    className={`w-full px-4 py-2 rounded text-sm transition-all ${(selectedMode === "words" &&
                        selectedWordCount === count) ||
                        (selectedMode !== "words" && count === 25)
                        ? "bg-[#D8AB19] text-[#282828]"
                        : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                      }`}
                  >
                    {count}
                  </button>
                ))}

                <div className="border-t border-[#3c3836] my-2"></div>
                <button
                  onClick={onTogglePunctuation}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedPunctuation
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  punctuation
                </button>

                <button
                  onClick={onToggleNumbers}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedNumbers
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  numbers
                </button>
              </>
            ) : (
              groups.map((group) => (
                <button
                  key={group.index ?? "all"}
                  onClick={() => handleSelectGroup(group.index)}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${(selectedMode === "quotes" &&
                      selectedGroup === group.index) ||
                      (selectedMode !== "quotes" && group.index === null)
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  {group.label}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GroupModal;

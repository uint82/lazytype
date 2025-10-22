import { useState } from "react";

const GroupModal = ({
  groups,
  selectedGroup,
  selectedMode,
  selectedDuration,
  onSelectGroup,
  onSelectWords,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(selectedMode || "quotes");
  const wordDurations = [15, 30, 60, 120];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#282828] p-5 rounded-lg shadow-lg w-[90%] max-w-[320px] text-center">
        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("words")}
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "words"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              Words
            </button>

            <button
              onClick={() => setActiveTab("quotes")}
              className={`w-full px-4 py-2 rounded font-medium transition-all ${activeTab === "quotes"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              Quotes
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {activeTab === "words"
              ? wordDurations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    onSelectWords(duration);
                    onClose();
                  }}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedMode === "words" && selectedDuration === duration
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  {duration}s
                </button>
              ))
              : groups.map((group) => (
                <button
                  key={group.index ?? "all"}
                  onClick={() => {
                    onSelectGroup(group.index);
                    onClose();
                  }}
                  className={`w-full px-4 py-2 rounded text-sm transition-all ${selectedMode === "quotes" && selectedGroup === group.index
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                    }`}
                >
                  {group.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;

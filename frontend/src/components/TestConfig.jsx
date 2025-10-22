import { useState, useEffect } from "react";
import { getQuoteGroups } from "../controllers/quotes-controller";
import GroupModal from "./GroupModal";

const TestConfig = ({
  selectedGroup,
  setSelectedGroup,
  selectedMode,
  setSelectedMode,
  selectedDuration,
  setSelectedDuration,
}) => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  const wordDurations = [15, 30, 60, 120];

  useEffect(() => {
    const loadedGroups = getQuoteGroups();
    setGroups(loadedGroups);

    const handleResize = () => {
      setIsCompactView(window.innerWidth < 720);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectGroup = (groupIndex) => {
    setSelectedMode("quotes");
    setSelectedGroup(groupIndex);
    setIsModalOpen(false);
  };

  const handleSelectWords = (duration) => {
    setSelectedMode("words");
    setSelectedDuration(duration);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-8 text-[#ebdbb2]">
      {!isCompactView ? (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMode("words")}
              className={`px-4 py-2 rounded font-medium transition-all ${selectedMode === "words"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] hover:bg-[#504945]"
                }`}
            >
              Words
            </button>
            <button
              onClick={() => setSelectedMode("quotes")}
              className={`px-4 py-2 rounded font-medium transition-all ${selectedMode === "quotes"
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] hover:bg-[#504945]"
                }`}
            >
              Quotes
            </button>
          </div>

          <span className="text-[#a89984]">|</span>

          {selectedMode === "words" ? (
            <div className="flex flex-wrap gap-2 items-center">
              {wordDurations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => handleSelectWords(duration)}
                  className={`px-3 py-1 rounded transition-all text-sm ${selectedMode === "words" && selectedDuration === duration
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  {duration}s
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {groups.map((group) => (
                <button
                  key={group.index ?? "all"}
                  onClick={() => handleSelectGroup(group.index)}
                  className={`px-3 py-1 rounded transition-all text-sm ${selectedMode === "quotes" && selectedGroup === group.index
                      ? "bg-[#D8AB19] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] transition-all"
          >
            Test Configuration ▼
          </button>

          {isModalOpen && (
            <GroupModal
              groups={groups}
              selectedGroup={selectedGroup}
              selectedMode={selectedMode}
              selectedDuration={selectedDuration}
              onSelectGroup={handleSelectGroup}
              onSelectWords={handleSelectWords}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TestConfig;

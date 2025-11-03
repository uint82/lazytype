import { useState, useEffect } from "react";
import { getQuoteGroups } from "../controllers/quotes-controller";
import GroupModal from "./GroupModal";
import LanguageSelector from "./LanguageSelector";

const TestConfig = ({
  selectedGroup,
  setSelectedGroup,
  selectedMode,
  setSelectedMode,
  selectedDuration,
  setSelectedDuration,
  selectedLanguage,
  setSelectedLanguage,
  onNewTest,
}) => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  const testDurations = [15, 30, 60, 120];

  useEffect(() => {
    const loadedGroups = getQuoteGroups(selectedLanguage);
    setGroups(loadedGroups);

    const handleResize = () => {
      setIsCompactView(window.innerWidth < 720);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedLanguage]);

  const handleSelectGroup = (groupIndex) => {
    setSelectedMode("quotes");
    setSelectedGroup(groupIndex);
  };

  const handleSelectTime = (duration) => {
    setSelectedMode("time");
    setSelectedDuration(duration);
    if (onNewTest) {
      onNewTest();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center items-center gap-3 text-[#ebdbb2]">
        {!isCompactView ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMode("time")}
                className={`px-4 py-2 rounded font-medium transition-all ${selectedMode === "time"
                    ? "bg-[#D8AB19] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945]"
                  }`}
              >
                Time
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

            {selectedMode === "time" ? (
              <div className="flex flex-wrap gap-2 items-center">
                {testDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleSelectTime(duration)}
                    className={`px-3 py-1 rounded transition-all text-sm ${selectedMode === "time" && selectedDuration === duration
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
                onSelectTime={handleSelectTime}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </>
        )}
      </div>

      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};

export default TestConfig;

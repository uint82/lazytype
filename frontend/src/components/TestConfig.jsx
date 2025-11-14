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
  selectedWordCount,
  setSelectedWordCount,
  selectedLanguage,
  selectedPunctuation,
  setSelectedPunctuation,
  selectedNumbers,
  setSelectedNumbers,
  onNewTest,
}) => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  const testDurations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

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
    if (onNewTest) {
      onNewTest();
    }
  };

  const handleSelectTime = (duration) => {
    setSelectedMode("time");
    setSelectedDuration(duration);
    if (onNewTest) {
      onNewTest();
    }
  };

  const handleSelectWords = (count) => {
    setSelectedMode("words");
    setSelectedWordCount(count);
    if (onNewTest) {
      onNewTest();
    }
  };

  const handleTogglePunctuation = () => {
    setSelectedPunctuation(!selectedPunctuation);
    if (onNewTest) {
      onNewTest();
    }
  };

  const handleToggleNumbers = () => {
    setSelectedNumbers(!selectedNumbers);
    if (onNewTest) {
      onNewTest();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-3">
      <div className="flex flex-wrap justify-center items-center gap-2 text-[#ebdbb2]">
        {!isCompactView ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {(selectedMode === "time" || selectedMode === "words") && (
              <>
                <div className="flex flex-wrap gap-1 items-center">
                  <button
                    onClick={handleTogglePunctuation}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedPunctuation
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                      }`}
                  >
                    punctuation
                  </button>
                  <button
                    onClick={handleToggleNumbers}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedNumbers
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                      }`}
                  >
                    numbers
                  </button>
                </div>

                <span className="text-[#a89984] mx-0.5 text-xs">|</span>
              </>
            )}

            <div className="flex gap-1">
              <button
                onClick={() => {
                  setSelectedMode("time");
                  if (onNewTest) {
                    onNewTest();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedMode === "time"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945]"
                  }`}
              >
                Time
              </button>
              <button
                onClick={() => {
                  setSelectedMode("words");
                  if (onNewTest) {
                    onNewTest();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedMode === "words"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945]"
                  }`}
              >
                Words
              </button>
              <button
                onClick={() => {
                  setSelectedMode("quotes");
                  if (onNewTest) {
                    onNewTest();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedMode === "quotes"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945]"
                  }`}
              >
                Quotes
              </button>
            </div>

            <span className="text-[#a89984] mx-0.5 text-xs">|</span>

            {selectedMode === "time" ? (
              <div className="flex flex-wrap gap-1 items-center">
                {testDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleSelectTime(duration)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "time" && selectedDuration === duration
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                      }`}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            ) : selectedMode === "words" ? (
              <div className="flex flex-wrap gap-1 items-center">
                {wordCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => handleSelectWords(count)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "words" && selectedWordCount === count
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                      }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 items-center">
                {groups.map((group) => (
                  <button
                    key={group.index ?? "all"}
                    onClick={() => handleSelectGroup(group.index)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "quotes" && selectedGroup === group.index
                        ? "bg-[#83A598] text-[#282828]"
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
              className="px-3 py-1.5 rounded-md text-sm bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] transition-all font-medium"
            >
              Test Configuration ▼
            </button>

            {isModalOpen && (
              <GroupModal
                groups={groups}
                selectedGroup={selectedGroup}
                selectedMode={selectedMode}
                selectedDuration={selectedDuration}
                selectedWordCount={selectedWordCount}
                selectedPunctuation={selectedPunctuation}
                selectedNumbers={selectedNumbers}
                onSelectGroup={handleSelectGroup}
                onSelectTime={handleSelectTime}
                onSelectWords={handleSelectWords}
                onTogglePunctuation={handleTogglePunctuation}
                onToggleNumbers={handleToggleNumbers}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestConfig;

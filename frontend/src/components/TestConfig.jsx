import { useState, useEffect } from "react";
import { Search, PencilRuler } from "lucide-react";
import { getQuoteGroups } from "../controllers/quotes-controller";
import GroupModal from "./GroupModal";
import QuoteSearchModal from "./QuoteSearchModal";
import CustomConfigModal from "./CustomConfigModal";

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
  quotes,
  onSelectSpecificQuote,
  selectedQuoteId,
  addNotification,
  setIsModalOpen,
}) => {
  const [groups, setGroups] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCustomConfigOpen, setIsCustomConfigOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [searchModalState, setSearchModalState] = useState({
    searchTerm: "",
    selectedLength: "all",
    currentPage: 1,
  });

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
  };

  const handleSelectTime = (duration) => {
    setSelectedMode("time");
    setSelectedDuration(duration);
  };

  const handleSelectWords = (count) => {
    setSelectedMode("words");
    setSelectedWordCount(count);
  };

  const handleTogglePunctuation = () => {
    setSelectedPunctuation(!selectedPunctuation);
  };

  const handleToggleNumbers = () => {
    setSelectedNumbers(!selectedNumbers);
  };

  const handleSelectSpecificQuote = (quote) => {
    if (onSelectSpecificQuote) {
      onSelectSpecificQuote(quote);
    }
  };

  const handleCustomConfig = (value) => {
    if (selectedMode === "time") {
      setSelectedDuration(value);
    } else if (selectedMode === "words") {
      setSelectedWordCount(value);
    }
    setIsCustomConfigOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center items-center text-[#ebdbb2]">
        {!isCompactView ? (
          <div className="flex flex-wrap gap-1 items-center">
            {(selectedMode === "time" || selectedMode === "words") && (
              <>
                <div className="flex flex-wrap gap-1 items-center">
                  <button
                    onClick={handleTogglePunctuation}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-medium ${selectedPunctuation
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                      }`}
                  >
                    punctuation
                  </button>
                  <button
                    onClick={handleToggleNumbers}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-medium ${selectedNumbers
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
                onClick={() => setSelectedMode("time")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${selectedMode === "time"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945] cursor-pointer"
                  }`}
              >
                time
              </button>
              <button
                onClick={() => setSelectedMode("words")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${selectedMode === "words"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945] cursor-pointer"
                  }`}
              >
                words
              </button>
              <button
                onClick={() => setSelectedMode("quotes")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${selectedMode === "quotes"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945] cursor-pointer"
                  }`}
              >
                quotes
              </button>
              <button
                onClick={() => setSelectedMode("zen")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${selectedMode === "zen"
                    ? "bg-[#D8A657] text-[#282828]"
                    : "bg-[#3c3836] hover:bg-[#504945] cursor-pointer"
                  }`}
              >
                zen
              </button>
            </div>
            {selectedMode !== "zen" && (
              <span className="text-[#a89984] mx-0.5 text-xs">|</span>
            )}
            {selectedMode === "time" ? (
              <div className="flex flex-wrap gap-1 items-center">
                {testDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleSelectTime(duration)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "time" && selectedDuration === duration
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2] cursor-pointer"
                      }`}
                  >
                    {duration}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomConfigOpen(true)}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${![15, 30, 60, 120].includes(selectedDuration) ||
                      selectedDuration === 0
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  <PencilRuler size={16} />
                </button>
              </div>
            ) : selectedMode === "words" ? (
              <div className="flex flex-wrap gap-1 items-center">
                {wordCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => handleSelectWords(count)}
                    className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "words" && selectedWordCount === count
                        ? "bg-[#83A598] text-[#282828]"
                        : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2] cursor-pointer"
                      }`}
                  >
                    {count}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomConfigOpen(true)}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${![10, 25, 50, 100].includes(selectedWordCount) ||
                      selectedWordCount === 0
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  <PencilRuler size={16} />
                </button>
              </div>
            ) : selectedMode === "quotes" ? (
              <>
                <div className="flex flex-wrap gap-1 items-center">
                  {groups.map((group) => (
                    <button
                      key={group.index ?? "all"}
                      onClick={() => handleSelectGroup(group.index)}
                      className={`px-2.5 py-1 rounded-md transition-all text-xs font-medium ${selectedMode === "quotes" &&
                          selectedGroup === group.index &&
                          !selectedQuoteId
                          ? "bg-[#83A598] text-[#282828]"
                          : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2] cursor-pointer"
                        }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${selectedQuoteId
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                  title="Search quotes"
                >
                  <Search size={16} />
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-sm bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] transition-all cursor-pointer font-medium"
            >
              Test Configuration ▼
            </button>
            {isGroupModalOpen && (
              <GroupModal
                groups={groups}
                selectedGroup={selectedGroup}
                selectedMode={selectedMode}
                selectedDuration={selectedDuration}
                selectedWordCount={selectedWordCount}
                selectedPunctuation={selectedPunctuation}
                selectedNumbers={selectedNumbers}
                selectedQuoteId={selectedQuoteId}
                onSelectGroup={handleSelectGroup}
                onSelectTime={handleSelectTime}
                onSelectWords={handleSelectWords}
                onTogglePunctuation={handleTogglePunctuation}
                onToggleNumbers={handleToggleNumbers}
                onOpenSearchModal={() => setIsSearchModalOpen(true)}
                onClose={() => setIsGroupModalOpen(false)}
                onOpenCustomConfig={(mode) => {
                  setIsGroupModalOpen(false);
                  setSelectedMode(mode);
                  setIsCustomConfigOpen(true);
                }}
                onSetMode={setSelectedMode}
                onModalOpen={() => setIsModalOpen?.(true)}
                onModalClose={() => setIsModalOpen?.(false)}
              />
            )}
          </>
        )}
      </div>

      {isSearchModalOpen && (
        <QuoteSearchModal
          quotes={quotes}
          onSelectQuote={handleSelectSpecificQuote}
          onClose={() => setIsSearchModalOpen(false)}
          initialSearchTerm={searchModalState.searchTerm}
          initialSelectedLength={searchModalState.selectedLength}
          initialCurrentPage={searchModalState.currentPage}
          onStateChange={setSearchModalState}
        />
      )}

      {isCustomConfigOpen && (
        <CustomConfigModal
          mode={selectedMode}
          currentValue={
            selectedMode === "time" ? selectedDuration : selectedWordCount
          }
          onConfirm={handleCustomConfig}
          onClose={() => setIsCustomConfigOpen(false)}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default TestConfig;

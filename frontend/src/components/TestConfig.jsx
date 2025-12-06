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
      <div
        className="flex flex-wrap justify-center items-center"
        style={{ color: "var(--text)" }}
      >
        {!isCompactView ? (
          <div className="flex flex-wrap gap-1 items-center">
            {(selectedMode === "time" || selectedMode === "words") && (
              <>
                <div className="flex flex-wrap gap-1 items-center">
                  <button
                    onClick={handleTogglePunctuation}
                    className="px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-medium"
                    style={{
                      backgroundColor: selectedPunctuation
                        ? "var(--main)"
                        : "var(--sub-alt)",
                      color: selectedPunctuation ? "var(--bg)" : "var(--text)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedPunctuation) {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedPunctuation) {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                  >
                    punctuation
                  </button>
                  <button
                    onClick={handleToggleNumbers}
                    className="px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-medium"
                    style={{
                      backgroundColor: selectedNumbers
                        ? "var(--main)"
                        : "var(--sub-alt)",
                      color: selectedNumbers ? "var(--bg)" : "var(--text)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedNumbers) {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedNumbers) {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                  >
                    numbers
                  </button>
                </div>
                <span
                  className="mx-0.5 text-xs"
                  style={{ color: "var(--sub)" }}
                >
                  |
                </span>
              </>
            )}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedMode("time")}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedMode === "time" ? "var(--main)" : "var(--sub-alt)",
                  color: selectedMode === "time" ? "var(--bg)" : "var(--text)",
                }}
                onMouseEnter={(e) => {
                  if (selectedMode !== "time") {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMode !== "time") {
                    e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                time
              </button>
              <button
                onClick={() => setSelectedMode("words")}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedMode === "words" ? "var(--main)" : "var(--sub-alt)",
                  color: selectedMode === "words" ? "var(--bg)" : "var(--text)",
                }}
                onMouseEnter={(e) => {
                  if (selectedMode !== "words") {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMode !== "words") {
                    e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                words
              </button>
              <button
                onClick={() => setSelectedMode("quotes")}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedMode === "quotes"
                      ? "var(--main)"
                      : "var(--sub-alt)",
                  color:
                    selectedMode === "quotes" ? "var(--bg)" : "var(--text)",
                }}
                onMouseEnter={(e) => {
                  if (selectedMode !== "quotes") {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMode !== "quotes") {
                    e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                quotes
              </button>
              <button
                onClick={() => setSelectedMode("zen")}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    selectedMode === "zen" ? "var(--main)" : "var(--sub-alt)",
                  color: selectedMode === "zen" ? "var(--bg)" : "var(--text)",
                }}
                onMouseEnter={(e) => {
                  if (selectedMode !== "zen") {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMode !== "zen") {
                    e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                zen
              </button>
            </div>
            {selectedMode !== "zen" && (
              <span className="mx-0.5 text-xs" style={{ color: "var(--sub)" }}>
                |
              </span>
            )}
            {selectedMode === "time" ? (
              <div className="flex flex-wrap gap-1 items-center">
                {testDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleSelectTime(duration)}
                    className="px-2.5 py-1 rounded-md transition-all text-xs font-medium"
                    style={{
                      backgroundColor:
                        selectedMode === "time" && selectedDuration === duration
                          ? "var(--main)"
                          : "var(--sub-alt)",
                      color:
                        selectedMode === "time" && selectedDuration === duration
                          ? "var(--bg)"
                          : "var(--text)",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !(
                          selectedMode === "time" &&
                          selectedDuration === duration
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !(
                          selectedMode === "time" &&
                          selectedDuration === duration
                        )
                      ) {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                  >
                    {duration}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomConfigOpen(true)}
                  className="p-1.5 rounded-md transition-all cursor-pointer"
                  style={{
                    backgroundColor:
                      ![15, 30, 60, 120].includes(selectedDuration) ||
                        selectedDuration === 0
                        ? "var(--main)"
                        : "var(--sub-alt)",
                    color:
                      ![15, 30, 60, 120].includes(selectedDuration) ||
                        selectedDuration === 0
                        ? "var(--bg)"
                        : "var(--text)",
                  }}
                  onMouseEnter={(e) => {
                    if (
                      [15, 30, 60, 120].includes(selectedDuration) &&
                      selectedDuration !== 0
                    ) {
                      e.currentTarget.style.backgroundColor = "var(--text)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (
                      [15, 30, 60, 120].includes(selectedDuration) &&
                      selectedDuration !== 0
                    ) {
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
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
                    className="px-2.5 py-1 rounded-md transition-all text-xs font-medium"
                    style={{
                      backgroundColor:
                        selectedMode === "words" && selectedWordCount === count
                          ? "var(--main)"
                          : "var(--sub-alt)",
                      color:
                        selectedMode === "words" && selectedWordCount === count
                          ? "var(--bg)"
                          : "var(--text)",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        !(
                          selectedMode === "words" &&
                          selectedWordCount === count
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        !(
                          selectedMode === "words" &&
                          selectedWordCount === count
                        )
                      ) {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                  >
                    {count}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomConfigOpen(true)}
                  className="p-1.5 rounded-md transition-all cursor-pointer"
                  style={{
                    backgroundColor:
                      ![10, 25, 50, 100].includes(selectedWordCount) ||
                        selectedWordCount === 0
                        ? "var(--main)"
                        : "var(--sub-alt)",
                    color:
                      ![10, 25, 50, 100].includes(selectedWordCount) ||
                        selectedWordCount === 0
                        ? "var(--bg)"
                        : "var(--text)",
                  }}
                  onMouseEnter={(e) => {
                    if (
                      [10, 25, 50, 100].includes(selectedWordCount) &&
                      selectedWordCount !== 0
                    ) {
                      e.currentTarget.style.backgroundColor = "var(--text)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (
                      [10, 25, 50, 100].includes(selectedWordCount) &&
                      selectedWordCount !== 0
                    ) {
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
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
                      className="px-2.5 py-1 rounded-md transition-all text-xs font-medium"
                      style={{
                        backgroundColor:
                          selectedMode === "quotes" &&
                            selectedGroup === group.index &&
                            !selectedQuoteId
                            ? "var(--main)"
                            : "var(--sub-alt)",
                        color:
                          selectedMode === "quotes" &&
                            selectedGroup === group.index &&
                            !selectedQuoteId
                            ? "var(--bg)"
                            : "var(--text)",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !(
                            selectedMode === "quotes" &&
                            selectedGroup === group.index &&
                            !selectedQuoteId
                          )
                        ) {
                          e.currentTarget.style.backgroundColor = "var(--text)";
                          e.currentTarget.style.color = "var(--bg)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !(
                            selectedMode === "quotes" &&
                            selectedGroup === group.index &&
                            !selectedQuoteId
                          )
                        ) {
                          e.currentTarget.style.backgroundColor =
                            "var(--sub-alt)";
                          e.currentTarget.style.color = "var(--text)";
                        }
                      }}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-1.5 rounded-md transition-all cursor-pointer"
                  style={{
                    backgroundColor: selectedQuoteId
                      ? "var(--main)"
                      : "var(--sub-alt)",
                    color: selectedQuoteId ? "var(--bg)" : "var(--text)",
                  }}
                  title="Search quotes"
                  onMouseEnter={(e) => {
                    if (!selectedQuoteId) {
                      e.currentTarget.style.backgroundColor = "var(--text)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedQuoteId) {
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
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
              className="px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer font-medium"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--sub)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--sub-alt)")
              }
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
          onModalOpen={() => setIsModalOpen?.(true)}
          onModalClose={() => setIsModalOpen?.(false)}
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

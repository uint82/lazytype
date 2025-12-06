import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { WrenchIcon } from "lucide-react";

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
  onOpenCustomConfig,
  onSetMode,
  onModalOpen,
  onModalClose,
}) => {
  const [activeTab, setActiveTab] = useState(selectedMode || "quotes");

  const timeDurations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    onModalOpen?.();
    return () => onModalClose?.();
  }, [onModalOpen, onModalClose]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999]
      transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleOverlayClick}
    >
      <div
        className={`p-5 rounded-lg shadow-lg w-[90%] max-w-[320px] text-center
        transition-all duration-150 transform ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {["time", "words", "quotes", "zen"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "time") onSelectTime(selectedDuration);
                  if (tab === "words") onSelectWords(selectedWordCount);
                  if (tab === "quotes") {
                    if (selectedQuoteId) onSetMode("quotes");
                    else onSelectGroup(selectedGroup ?? null);
                  }
                  if (tab === "zen") onSetMode("zen");
                }}
                className="w-full px-4 py-2 rounded transition-all"
                style={{
                  backgroundColor:
                    activeTab === tab ? "var(--main)" : "var(--sub-alt)",
                  color: activeTab === tab ? "var(--bg)" : "var(--text)",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {activeTab === "time" ? (
              <>
                {timeDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onSelectTime(duration)}
                    className="w-full px-4 py-2 rounded text-sm transition-all"
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
                  onClick={() => {
                    handleClose();
                    onOpenCustomConfig("time");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-sm transition-all cursor-pointer"
                  style={{
                    backgroundColor: ![15, 30, 60, 120].includes(
                      selectedDuration,
                    )
                      ? "var(--main)"
                      : "var(--sub-alt)",
                    color: ![15, 30, 60, 120].includes(selectedDuration)
                      ? "var(--bg)"
                      : "var(--text)",
                  }}
                  onMouseEnter={(e) => {
                    if ([15, 30, 60, 120].includes(selectedDuration)) {
                      e.currentTarget.style.backgroundColor = "var(--text)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ([15, 30, 60, 120].includes(selectedDuration)) {
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  <WrenchIcon size={16} />
                  Custom
                </button>

                <div
                  className="my-2"
                  style={{ borderTop: "1px solid var(--sub-alt)" }}
                ></div>

                <button
                  onClick={onTogglePunctuation}
                  className="w-full px-4 py-2 rounded text-sm transition-all cursor-pointer"
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
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  punctuation
                </button>

                <button
                  onClick={onToggleNumbers}
                  className="w-full px-4 py-2 rounded text-sm transition-all cursor-pointer"
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
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  numbers
                </button>
              </>
            ) : activeTab === "words" ? (
              <>
                {wordCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => onSelectWords(count)}
                    className="w-full px-4 py-2 rounded text-sm transition-all"
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
                  onClick={() => {
                    handleClose();
                    onOpenCustomConfig("words");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-sm transition-all cursor-pointer"
                  style={{
                    backgroundColor: ![10, 25, 50, 100].includes(
                      selectedWordCount,
                    )
                      ? "var(--main)"
                      : "var(--sub-alt)",
                    color: ![10, 25, 50, 100].includes(selectedWordCount)
                      ? "var(--bg)"
                      : "var(--text)",
                  }}
                  onMouseEnter={(e) => {
                    if ([10, 25, 50, 100].includes(selectedWordCount)) {
                      e.currentTarget.style.backgroundColor = "var(--text)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ([10, 25, 50, 100].includes(selectedWordCount)) {
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  <WrenchIcon size={16} />
                  Custom
                </button>

                <div
                  className="my-2"
                  style={{ borderTop: "1px solid var(--sub-alt)" }}
                ></div>

                <button
                  onClick={onTogglePunctuation}
                  className="w-full px-4 py-2 rounded text-sm transition-all cursor-pointer"
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
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  punctuation
                </button>

                <button
                  onClick={onToggleNumbers}
                  className="w-full px-4 py-2 rounded text-sm transition-all cursor-pointer"
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
                      e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                >
                  numbers
                </button>
              </>
            ) : activeTab === "zen" ? (
              <></>
            ) : (
              <>
                {groups.map((group) => (
                  <button
                    key={group.index ?? "all"}
                    onClick={() => onSelectGroup(group.index)}
                    className="w-full px-4 py-2 rounded text-sm transition-all"
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

                <button
                  onClick={() => {
                    handleClose();
                    onOpenSearchModal();
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer"
                  style={{
                    backgroundColor: selectedQuoteId
                      ? "var(--main)"
                      : "var(--sub-alt)",
                    color: selectedQuoteId ? "var(--bg)" : "var(--text)",
                  }}
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

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

const QuoteSearchModal = ({
  quotes,
  onSelectQuote,
  onClose,
  initialSearchTerm = "",
  initialSelectedLength = "all",
  initialCurrentPage = 1,
  onStateChange,
  onModalOpen,
  onModalClose,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(initialSearchTerm);
  const [selectedLength, setSelectedLength] = useState(initialSelectedLength);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isFiltering, setIsFiltering] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [interactionMode, setInteractionMode] = useState("keyboard");
  const [sortOrder, setSortOrder] = useState("desc");

  const searchInputRef = useRef(null);
  const itemRefs = useRef([]);

  const normalizeText = useCallback((text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase();
  }, []);

  const searchableData = useMemo(() => {
    if (!quotes) return [];
    return quotes.map((quote) => ({
      original: quote,
      normText: normalizeText(quote.text),
      normSource: normalizeText(quote.source),
      idStr: quote.id.toString(),
      length: quote.length,
    }));
  }, [quotes, normalizeText]);

  useEffect(() => {
    onModalOpen?.();
    return () => onModalClose?.();
  }, [onModalOpen, onModalClose]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 150);
  }, [onClose]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const lengthCategories = useMemo(
    () => ({
      all: { label: "All", min: 0, max: Infinity },
      short: { label: "Short", min: 0, max: 100 },
      medium: { label: "Medium", min: 101, max: 300 },
      long: { label: "Long", min: 301, max: 600 },
      veryLong: { label: "Very Long", min: 601, max: Infinity },
    }),
    [],
  );

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      let candidates = searchableData;

      if (selectedLength !== "all") {
        const { min, max } = lengthCategories[selectedLength];
        candidates = candidates.filter(
          (item) => item.length >= min && item.length <= max,
        );
      }

      if (debouncedSearchTerm.trim()) {
        const termRaw = normalizeText(debouncedSearchTerm.trim());
        const searchTerms = termRaw.split(/\s+/).filter((t) => t.length > 0);

        const scored = candidates
          .map((item) => {
            let score = 0;
            const { normText, normSource, idStr, length } = item;

            const matchesAllTerms = searchTerms.every((term) => {
              const inText = normText.includes(term);
              const inSource = normSource.includes(term);
              const inId = idStr.includes(term);

              if (inId) {
                score += 10000;
                if (idStr === term) score += 5000;
              }

              if (inSource) {
                score += 200;
                if (normSource === term) score += 500;
                if (normSource.startsWith(term)) score += 300;

                try {
                  if (new RegExp(`\\b${term}\\b`, "i").test(normSource)) {
                    score += 250;
                  }
                } catch (e) {
                  console.debug("Regex error for term:", term, e);
                }

                if (normSource.endsWith(term)) score += 150;
              }

              if (inText) {
                score += 50;

                if (normText.includes(termRaw)) {
                  score += 800;
                  if (normText.startsWith(termRaw)) score += 400;
                }

                try {
                  if (new RegExp(`\\b${term}\\b`, "i").test(normText)) {
                    score += 400;
                  }
                } catch (e) {
                  console.debug("Regex error for term:", term, e);
                }

                const position = normText.indexOf(term);
                if (position !== -1) {
                  const relativePosition = position / normText.length;
                  if (relativePosition < 0.1) score += 200;
                  else if (relativePosition < 0.25) score += 100;
                  else if (relativePosition < 0.5) score += 50;
                }

                const occurrences = (
                  normText.match(new RegExp(term, "g")) || []
                ).length;
                if (occurrences > 1) {
                  score += Math.min(occurrences * 30, 150);
                }
              }

              return inText || inSource || inId;
            });

            if (!matchesAllTerms) return null;

            if (searchTerms.length > 1) {
              score += searchTerms.length * 100;

              let minDistance = Infinity;
              for (let i = 0; i < searchTerms.length - 1; i++) {
                const pos1 = normText.indexOf(searchTerms[i]);
                const pos2 = normText.indexOf(searchTerms[i + 1]);
                if (pos1 !== -1 && pos2 !== -1) {
                  const distance = Math.abs(pos2 - pos1);
                  minDistance = Math.min(minDistance, distance);
                }
              }
              if (minDistance !== Infinity && minDistance < 50) {
                score += 500 - minDistance * 5;
              }
            }

            if (length < 150) {
              score += 100;
            } else if (length > 500) {
              score -= 50;
            }

            score = score / Math.sqrt(length / 100);

            return { ...item.original, _score: score };
          })
          .filter(Boolean);

        scored.sort((a, b) => b._score - a._score);
        setFilteredQuotes(scored);
      } else {
        const sorted = candidates
          .map((c) => c.original)
          .sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id));
        setFilteredQuotes(sorted);
      }

      setCurrentPage(1);
      setSelectedIndex(0);
      setInteractionMode("keyboard");
      setIsFiltering(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [
    debouncedSearchTerm,
    selectedLength,
    searchableData,
    lengthCategories,
    normalizeText,
    sortOrder,
  ]);

  useEffect(() => {
    onStateChange?.({
      searchTerm,
      selectedLength,
      currentPage,
    });
  }, [searchTerm, selectedLength, currentPage, onStateChange]);

  const highlightRegex = useMemo(() => {
    const query = debouncedSearchTerm;
    if (!query || !query.trim()) return null;

    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase();

    const terms = normalizedQuery
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (terms.length === 0) return null;

    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);

    const escaped = sortedTerms.map((t) => {
      const chars = t.split("");
      const pattern = chars.map((char) => {
        let c = char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        c = c
          .replace(/[a]/gi, "[aàáâäãåāăąǎ]")
          .replace(/[e]/gi, "[eèéêëēĕėęě]")
          .replace(/[i]/gi, "[iìíîïĩīĭįı]")
          .replace(/[o]/gi, "[oòóôöõōŏő]")
          .replace(/[u]/gi, "[uùúûüũūŭůűų]")
          .replace(/[n]/gi, "[nñńņň]")
          .replace(/[c]/gi, "[cçćĉċč]")
          .replace(/[s]/gi, "[sśŝşš]")
          .replace(/[y]/gi, "[yýÿŷ]")
          .replace(/[z]/gi, "[zźżž]");
        return c;
      });
      return pattern.join("[^\\w\\s]*");
    });

    return new RegExp(`(${escaped.join("|")})`, "gi");
  }, [debouncedSearchTerm]);

  const highlightText = useCallback(
    (text) => {
      if (!highlightRegex) return text;
      highlightRegex.lastIndex = 0;
      const parts = text.split(highlightRegex);
      return parts.map((part, i) => {
        if (highlightRegex.test(part)) {
          highlightRegex.lastIndex = 0;
          return (
            <mark
              key={i}
              className="bg-transparent font-bold"
              style={{ color: "var(--secondary)" }}
            >
              {part}
            </mark>
          );
        }
        highlightRegex.lastIndex = 0;
        return part;
      });
    },
    [highlightRegex],
  );

  const quotesPerPage = 100;
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxShown = 5;
    if (totalPages <= maxShown) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const left = currentPage - 1;
    const right = currentPage + 1;
    if (left > 2) pages.push("...");
    for (let p = Math.max(2, left); p <= Math.min(right, totalPages - 1); p++) {
      pages.push(p);
    }
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      setSelectedIndex(0);
      setInteractionMode("keyboard");
    }
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      setSelectedIndex(0);
      setInteractionMode("keyboard");
    }
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        setSelectedIndex(0);
        setInteractionMode("keyboard");
      }
    },
    [totalPages],
  );

  const handleQuoteClick = useCallback(
    (quote) => {
      onSelectQuote(quote);
      handleClose();
    },
    [onSelectQuote, handleClose],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentQuotes.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setInteractionMode("keyboard");
        setSelectedIndex((prev) =>
          prev < currentQuotes.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setInteractionMode("keyboard");
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentQuotes[selectedIndex]) {
          handleQuoteClick(currentQuotes[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuotes, selectedIndex, handleQuoteClick, handleClose]);

  useEffect(() => {
    if (interactionMode === "keyboard" && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex, interactionMode]);

  const handleMouseMove = (index) => {
    setInteractionMode("mouse");
    setSelectedIndex(index);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleClose}
    >
      <div
        className={`rounded-lg w-full max-w-3xl max-h-[79vh] overflow-y-auto flex flex-col transition-all duration-150 transform ${isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
          } max-w-[75vw] sm:max-w-[600px] md:max-w-[600px] lg:max-w-[850px] mx-auto sm:my-auto my-4`}
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "2px solid var(--border)",
          fontFamily:
            "'Roboto Mono', monospace, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-between items-center p-3 sm:p-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Search Quotes
          </h2>
          <button
            onClick={handleClose}
            className="transition-colors cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="p-3 sm:p-4 border-b space-y-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
              size={18}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by text, source, or ID... (e.g., 'resume')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--text-primary)",
                borderColor: "var(--input-focus)",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3">
              {Object.entries(lengthCategories).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLength(key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                  style={{
                    backgroundColor:
                      selectedLength === key
                        ? "var(--info)"
                        : "var(--button-bg)",
                    color:
                      selectedLength === key
                        ? "var(--bg-primary)"
                        : "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLength !== key) {
                      e.currentTarget.style.backgroundColor =
                        "var(--button-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLength !== key) {
                      e.currentTarget.style.backgroundColor =
                        "var(--button-bg)";
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex justify-between items-center text-xs sm:text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-2">
              <span>
                {filteredQuotes.length}{" "}
                {filteredQuotes.length === 1 ? "quote" : "quotes"} found
              </span>
              {!debouncedSearchTerm.trim() && (
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                  }
                  className="flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "var(--button-bg)",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--button-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--button-bg)")
                  }
                  title={
                    sortOrder === "desc"
                      ? "Sorted: Newest first"
                      : "Sorted: Oldest first"
                  }
                >
                  <ArrowUpDown size={12} />
                  <span className="text-[10px]">
                    {sortOrder === "desc" ? "Newest" : "Oldest"}
                  </span>
                </button>
              )}
            </div>
            {filteredQuotes.length > 0 && (
              <span>
                Showing {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredQuotes.length)} of{" "}
                {filteredQuotes.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2">
          <div className="min-h-[400px] sm:min-h-[500px]">
            {isFiltering ? (
              <div
                className="text-center py-8"
                style={{ color: "var(--text-muted)" }}
              >
                Searching...
              </div>
            ) : currentQuotes.length === 0 ? (
              <div
                className="text-center py-8"
                style={{ color: "var(--text-muted)" }}
              >
                No quotes found
              </div>
            ) : (
              currentQuotes.map((quote, index) => (
                <button
                  key={quote.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => handleQuoteClick(quote)}
                  onMouseEnter={() => handleMouseMove(index)}
                  className="w-full text-left p-3 rounded-md transition-all mb-2 group cursor-pointer"
                  style={{
                    ...(index === selectedIndex && {
                      boxShadow: "0 0 0 2px var(--info)",
                    }),
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="text-[10px] sm:text-xs font-medium transition-colors"
                      style={{ color: "var(--secondary)" }}
                    >
                      ID: {highlightText(quote.id.toString())}
                    </span>
                    <div
                      className="flex gap-2 text-[10px] sm:text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>{quote.length} chars</span>
                      <span>•</span>
                      <span style={{ color: "var(--info)" }}>
                        {quote.length <= 100
                          ? "Short"
                          : quote.length <= 300
                            ? "Medium"
                            : quote.length <= 600
                              ? "Long"
                              : "Very Long"}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-xs sm:text-sm mb-2 leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {highlightText(quote.text)}
                  </p>
                  <p
                    className="text-[10px] sm:text-xs italic"
                    style={{ color: "var(--text-muted)" }}
                  >
                    — {highlightText(quote.source)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div
            className="p-3 sm:p-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md transition-all"
                style={{
                  backgroundColor: "var(--button-bg)",
                  color:
                    currentPage === 1
                      ? "var(--text-dim)"
                      : "var(--text-primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor =
                      "var(--button-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--button-bg)";
                }}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {pageNumbers.map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="px-2 sm:px-3 py-1.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className="px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                      style={{
                        backgroundColor:
                          page === currentPage
                            ? "var(--info)"
                            : "var(--button-bg)",
                        color:
                          page === currentPage
                            ? "var(--bg-primary)"
                            : "var(--text-primary)",
                      }}
                      onMouseEnter={(e) => {
                        if (page !== currentPage) {
                          e.currentTarget.style.backgroundColor =
                            "var(--button-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== currentPage) {
                          e.currentTarget.style.backgroundColor =
                            "var(--button-bg)";
                        }
                      }}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md transition-all"
                style={{
                  backgroundColor: "var(--button-bg)",
                  color:
                    currentPage === totalPages
                      ? "var(--text-dim)"
                      : "var(--text-primary)",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor =
                      "var(--button-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--button-bg)";
                }}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSearchModal;

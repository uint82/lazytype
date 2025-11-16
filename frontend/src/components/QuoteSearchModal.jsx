import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

const QuoteSearchModal = ({
  quotes,
  onSelectQuote,
  onClose,
  initialSearchTerm = "",
  initialSelectedLength = "all",
  initialCurrentPage = 1,
  onStateChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedLength, setSelectedLength] = useState(initialSelectedLength);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isFiltering, setIsFiltering] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 150);
  };

  const quotesPerPage = 100;

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
    let filtered = quotes || [];

    if (selectedLength !== "all") {
      const { min, max } = lengthCategories[selectedLength];
      filtered = filtered.filter((q) => q.length >= min && q.length <= max);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.text.toLowerCase().includes(term) ||
          q.source.toLowerCase().includes(term) ||
          q.id.toString().includes(term),
      );
    }

    setFilteredQuotes(filtered);
    setCurrentPage(1);
    requestAnimationFrame(() => setIsFiltering(false));
  }, [searchTerm, selectedLength, quotes, lengthCategories]);

  useEffect(() => {
    onStateChange?.({
      searchTerm,
      selectedLength,
      currentPage,
    });
  }, [searchTerm, selectedLength, currentPage, onStateChange]);

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-[#D8A657] text-[#282828] rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

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
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  const handleQuoteClick = (quote) => {
    onSelectQuote(quote);
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#282828] rounded-lg w-full max-w-3xl
          max-h-[79vh]
          overflow-y-auto
          flex flex-col
          transition-all duration-150 transform
          ${isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
          }
          max-w-[75vw]
          sm:max-w-[600px]
          md:max-w-[600px]
          lg:max-w-[850px]
          mx-auto
          sm:my-auto
          my-4
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-[#3c3836] shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-[#ebdbb2]">
            Search Quotes
          </h2>
          <button
            onClick={handleClose}
            className="text-[#a89984] hover:text-[#ebdbb2] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-3 sm:p-4 border-b border-[#3c3836] space-y-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89984]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by text, source, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#3c3836] text-[#ebdbb2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#83A598] text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89984] hover:text-[#ebdbb2] transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-thin scrollbar-thumb-[#504945]">
              {Object.entries(lengthCategories).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLength(key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${selectedLength === key
                      ? "bg-[#83A598] text-[#282828]"
                      : "bg-[#3c3836] hover:bg-[#504945] text-[#ebdbb2]"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm text-[#a89984]">
            <span>
              {filteredQuotes.length}{" "}
              {filteredQuotes.length === 1 ? "quote" : "quotes"} found
            </span>
            {filteredQuotes.length > 0 && (
              <span>
                Showing {startIndex + 1} –{" "}
                {Math.min(endIndex, filteredQuotes.length)} of{" "}
                {filteredQuotes.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2">
          <div className="min-h-[400px] sm:min-h-[500px]">
            {isFiltering ? (
              <div className="text-center text-[#a89984] py-8">Loading…</div>
            ) : currentQuotes.length === 0 ? (
              <div className="text-center text-[#a89984] py-8">
                No quotes found
              </div>
            ) : (
              currentQuotes.map((quote) => (
                <button
                  key={quote.id}
                  onClick={() => handleQuoteClick(quote)}
                  className="w-full text-left p-3 bg-[#3c3836] hover:bg-[#504945] rounded-md transition-all mb-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] sm:text-xs font-medium text-[#D8A657]">
                      ID: {highlightText(quote.id.toString(), searchTerm)}
                    </span>
                    <div className="flex gap-2 text-[10px] sm:text-xs text-[#a89984]">
                      <span>{quote.length} chars</span>
                      <span>•</span>
                      <span className="text-[#83A598]">
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
                  <p className="text-[#ebdbb2] text-xs sm:text-sm mb-2">
                    {highlightText(quote.text, searchTerm)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#a89984] italic">
                    — {highlightText(quote.source, searchTerm)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="p-3 sm:p-4 border-t border-[#3c3836]">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md transition-all ${currentPage === 1
                    ? "bg-[#3c3836] text-[#665c54] cursor-not-allowed"
                    : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {pageNumbers.map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="px-2 sm:px-3 py-1.5 text-[#a89984]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${page === currentPage
                          ? "bg-[#83A598] text-[#282828]"
                          : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md transition-all ${currentPage === totalPages
                    ? "bg-[#3c3836] text-[#665c54] cursor-not-allowed"
                    : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                  }`}
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

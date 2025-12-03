import { Palette, X, Search, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { themes } from "../data/themes";
import { updateFavicon } from "../utils/updateFavicon";

const ThemeModal = ({ isOpen, onClose, currentThemeKey, setTheme }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const [filteredThemes, setFilteredThemes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const previewTimeout = useRef(null);
  const searchInputRef = useRef(null);
  const itemRefs = useRef([]);

  const normalizeText = useCallback((text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setDebouncedSearch("");
      setSelectedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      setHoveredTheme(null);

      const allThemes = Object.entries(themes);
      setFilteredThemes(allThemes);

      if (allThemes.length > 0) {
        clearTimeout(previewTimeout.current);
        previewTimeout.current = setTimeout(() => {
          setHoveredTheme(allThemes[0][0]);
        }, 500);
      }
    } else {
      setHoveredTheme(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const themeEntries = Object.entries(themes);

    if (!debouncedSearch.trim()) {
      setFilteredThemes(themeEntries);
      setSelectedIndex(0);
      return;
    }

    const termRaw = normalizeText(debouncedSearch.trim());
    const searchTerms = termRaw.split(/\s+/).filter((t) => t.length > 0);

    const scored = themeEntries
      .map(([key, themeOption]) => {
        let score = 0;
        const name = themeOption.name;
        const normName = normalizeText(name);
        const normKey = normalizeText(key);

        const matchesAllTerms = searchTerms.every((term) => {
          const inName = normName.includes(term);
          const inKey = normKey.includes(term);

          if (inKey) {
            score += 1000;
            if (normKey === term) score += 500;
          }

          if (inName) {
            score += 100;
            if (normName.startsWith(term)) score += 50;
            if (normName === term) score += 200;
          }

          return inName || inKey;
        });

        if (!matchesAllTerms) return null;

        return { key, themeOption, _score: score };
      })
      .filter(Boolean);

    scored.sort((a, b) => b._score - a._score);

    setFilteredThemes(scored.map((item) => [item.key, item.themeOption]));
    setSelectedIndex(0);
  }, [debouncedSearch, normalizeText]);

  const applyThemeToRoot = (themeKey) => {
    const selectedTheme = themes[themeKey] || themes.gruvbox;
    const root = document.documentElement;

    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== "name") {
        const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      }
    });
  };

  const activeThemeKey = hoveredTheme || currentThemeKey;
  const theme = themes[activeThemeKey] || themes.gruvbox;

  useEffect(() => {
    if (isOpen) {
      applyThemeToRoot(activeThemeKey);
      updateFavicon();
    }

    return () => {
      if (isOpen) {
        applyThemeToRoot(currentThemeKey);
        updateFavicon();
      }
    };
  }, [activeThemeKey, isOpen, currentThemeKey]);

  const handleHover = useCallback((themeKey) => {
    clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => {
      setHoveredTheme(themeKey);
    }, 300);
  }, []);

  useEffect(
    () => {
      const handleKeyDown = (e) => {
        if (!isOpen || filteredThemes.length === 0) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < filteredThemes.length - 1 ? prev + 1 : prev;
            handleHover(filteredThemes[next][0]);
            return next;
          });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            handleHover(filteredThemes[next][0]);
            return next;
          });
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredThemes[selectedIndex]) {
            handleThemeChange(filteredThemes[selectedIndex][0]);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, filteredThemes, selectedIndex, handleHover],
  );

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleThemeChange = (newKey) => {
    setTheme(newKey);
    onClose();
  };

  const getThemeContainerBg = (themeOption) => {
    const hex = themeOption.bgPrimary.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.3)";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingTop: "10vh",
        alignItems: "flex-start",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: theme.bgPrimary,
          border: `1px solid ${theme.border}`,
          maxHeight: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-4 border-b transition-colors duration-300"
          style={{ borderColor: theme.border }}
        >
          <div
            className="flex items-center gap-2"
            style={{ color: theme.textPrimary }}
          >
            <Palette size={18} />
            <h2 className="font-semibold">Select Theme</h2>
          </div>

          <button
            onClick={onClose}
            className="transition"
            style={{ color: theme.textMuted }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = theme.textPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = theme.textMuted)
            }
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 border-b transition-colors duration-300"
          style={{ borderColor: theme.border }}
        >
          <Search size={16} style={{ color: theme.textMuted }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search themes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent transition-colors duration-300 outline-none text-sm"
            style={{ color: theme.textPrimary }}
          />
        </div>

        <div className="overflow-y-auto p-4 grid grid-cols-1">
          {filteredThemes.length === 0 ? (
            <div
              className="text-center py-4 text-sm"
              style={{ color: theme.textMuted }}
            >
              No themes found
            </div>
          ) : (
            filteredThemes.map(([themeKey, themeOption], index) => {
              const isKeyboardSelected = index === selectedIndex;
              const isActive = themeKey === currentThemeKey;

              return (
                <button
                  key={themeKey}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => handleThemeChange(themeKey)}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                    handleHover(themeKey);
                  }}
                  className="group flex items-center justify-between p-3 transition-all cursor-pointer duration-300"
                  style={{
                    backgroundColor: isKeyboardSelected
                      ? theme.bgSecondary
                      : theme.bgPrimary,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 flex justify-center">
                      {isActive && (
                        <Check
                          size={16}
                          style={{
                            color: theme.primary,
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="text-sm"
                      style={{
                        fontWeight: isActive ? 600 : 400,
                        color: isKeyboardSelected
                          ? theme.primary
                          : isActive
                            ? theme.textPrimary
                            : theme.textSecondary,
                      }}
                    >
                      {themeOption.name}
                    </span>
                  </div>

                  <div
                    className="flex gap-1 px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: getThemeContainerBg(themeOption),
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: themeOption.bgPrimary,
                        border: "1px solid rgba(0,0,0,0.2)",
                      }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: themeOption.textPrimary,
                        border: "1px solid rgba(0,0,0,0.2)",
                      }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: themeOption.primary,
                        border: "1px solid rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;

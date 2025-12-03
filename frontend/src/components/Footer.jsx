import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, LifeBuoy, FileText, Shield, Palette } from "lucide-react";
import { themes } from "../data/themes";
import ThemeModal from "./ThemeModal";
import { updateFavicon } from "../utils/updateFavicon";

const Footer = ({
  isTyping,
  onOpenContact,
  onOpenSupport,
  currentThemeKey = "gruvbox",
  setTheme,
}) => {
  const currentYear = new Date().getFullYear();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    const selectedTheme = themes[currentThemeKey] || themes.gruvbox;
    const root = document.documentElement;

    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key !== "name") {
        const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      }
    });

    updateFavicon();
  }, [currentThemeKey]);

  return (
    <>
      <footer
        className={`content-grid relative py-6 mt-34 transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <div className="full-width absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">
          <span
            className="full-width flex items-center gap-2 whitespace-nowrap"
            style={{ color: "var(--text-untyped)" }}
          >
            <span
              className="rounded px-2 py-0.1 shadow-sm mx-0.5"
              style={{
                backgroundColor: "var(--text-untyped)",
                color: "var(--bg-primary)",
                opacity: 0.6,
              }}
            >
              tab
            </span>
            +
            <span
              className="rounded px-2 py-0.1 shadow-sm mx-0.5"
              style={{
                backgroundColor: "var(--text-untyped)",
                color: "var(--bg-primary)",
                opacity: 0.6,
              }}
            >
              Enter
            </span>
            -<span style={{ color: "var(--text-untyped)" }}>restart test</span>
          </span>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          <div className="flex space-x-6 mb-3 sm:mb-0">
            <button
              onClick={onOpenContact}
              className="cursor-pointer transition flex items-center gap-1"
              style={{ color: "var(--text-untyped)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-untyped)")
              }
            >
              <Mail size={16} />
              contact
            </button>

            <button
              onClick={onOpenSupport}
              className="cursor-pointer transition flex items-center gap-1"
              style={{ color: "var(--text-untyped)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-untyped)")
              }
            >
              <LifeBuoy size={16} />
              support
            </button>

            <Link
              to="/terms"
              className="transition flex items-center gap-1"
              style={{ color: "var(--text-untyped)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-untyped)")
              }
            >
              <FileText size={16} />
              terms
            </Link>

            <Link
              to="/privacy"
              className="transition flex items-center gap-1"
              style={{ color: "var(--text-untyped)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-untyped)")
              }
            >
              <Shield size={16} />
              privacy
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="cursor-pointer transition flex items-center gap-1"
              style={{ color: "var(--text-untyped)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-untyped)")
              }
            >
              <Palette size={16} />
              {themes[currentThemeKey]?.name || "Theme"}
            </button>

            <p style={{ color: "var(--text-untyped)" }}>
              {currentYear} inspired by{" "}
              <a
                href="https://monkeytype.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition underline"
                style={{ color: "var(--text-untyped)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-untyped)")
                }
              >
                monkeytype
              </a>
            </p>
          </div>
        </div>
      </footer>

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeKey={currentThemeKey}
        setTheme={setTheme}
      />
    </>
  );
};

export default Footer;

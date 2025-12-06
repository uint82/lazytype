import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("theme");
  const [isCompactView, setIsCompactView] = useState(false);

  // Toggle states for each section
  const [isThemeOpen, setIsThemeOpen] = useState(true);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
  const [isSoundOpen, setIsSoundOpen] = useState(true);
  const [isCaretOpen, setIsCaretOpen] = useState(true);

  const themeRef = useRef(null);
  const appearanceRef = useRef(null);
  const soundRef = useRef(null);
  const caretRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsCompactView(window.innerWidth < 720);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (section) => {
    setActiveTab(section);

    let ref;
    if (section === "theme") ref = themeRef;
    else if (section === "appearance") ref = appearanceRef;
    else if (section === "sound") ref = soundRef;
    else if (section === "caret") ref = caretRef;

    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation - TestConfig Style */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div
          className="flex flex-wrap justify-center items-center"
          style={{ color: "var(--text)" }}
        >
          <div className="flex gap-1">
            <button
              onClick={() => scrollToSection("theme")}
              className="px-3 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--text)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              theme
            </button>
            <button
              onClick={() => scrollToSection("appearance")}
              className="px-3 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--text)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              appearance
            </button>
            <button
              onClick={() => scrollToSection("sound")}
              className="px-3 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--text)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              sound
            </button>
            <button
              onClick={() => scrollToSection("caret")}
              className="px-3 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--text)";
                e.currentTarget.style.color = "var(--bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub-alt)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              caret
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="content-grid">
        <p className="tet-center flex justify-center underline bg-red-500 text-black">
          UNDER CONSTRUCTION
        </p>
        <div className="mx-auto w-full space-y-12">
          {/* Theme Section */}
          <div ref={themeRef} className="scroll-mt-24">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center justify-between w-full mb-6 cursor-pointer transition-colors"
              style={{ color: "var(--sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sub)";
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Lexend Deca" }}
              >
                Theme
              </h2>
              {isThemeOpen ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            {isThemeOpen && (
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--bg)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Color Theme
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Choose your preferred color theme
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Theme buttons will go here */}
                      <div
                        className="w-8 h-8 rounded-full cursor-pointer border-2"
                        style={{
                          backgroundColor: "var(--main)",
                          borderColor: "var(--sub-alt)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Appearance Section */}
          <div ref={appearanceRef} className="scroll-mt-24">
            <button
              onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
              className="flex items-center justify-between w-full mb-6 cursor-pointer transition-colors"
              style={{ color: "var(--sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sub)";
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Lexend Deca" }}
              >
                Appearance
              </h2>
              {isAppearanceOpen ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            {isAppearanceOpen && (
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--bg)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Font Family
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Select the font for the typing test
                      </p>
                    </div>
                    <select
                      className="px-3 py-2 rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--sub-alt)",
                        color: "var(--text)",
                        border: "none",
                      }}
                    >
                      <option>Roboto Mono</option>
                      <option>Fira Code</option>
                      <option>JetBrains Mono</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sound Section */}
          <div ref={soundRef} className="scroll-mt-24">
            <button
              onClick={() => setIsSoundOpen(!isSoundOpen)}
              className="flex items-center justify-between w-full mb-6 cursor-pointer transition-colors"
              style={{ color: "var(--sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sub)";
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Lexend Deca" }}
              >
                Sound
              </h2>
              {isSoundOpen ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            {isSoundOpen && (
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--bg)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Click Sound
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Enable keyboard click sounds while typing
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        backgroundColor: "var(--sub-alt)",
                        color: "var(--text)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }}
                    >
                      Off
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Volume
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Adjust sound effect volume
                      </p>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caret Section */}
          <div ref={caretRef} className="scroll-mt-24">
            <button
              onClick={() => setIsCaretOpen(!isCaretOpen)}
              className="flex items-center justify-between w-full mb-6 cursor-pointer transition-colors"
              style={{ color: "var(--sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sub)";
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Lexend Deca" }}
              >
                Caret
              </h2>
              {isCaretOpen ? (
                <ChevronDown size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
            {isCaretOpen && (
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--bg)" }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Caret Style
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Choose how the caret appears
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                          backgroundColor: "var(--sub-alt)",
                          color: "var(--text)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--text)";
                          e.currentTarget.style.color = "var(--bg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--sub-alt)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                      >
                        Line
                      </button>
                      <button
                        className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                          backgroundColor: "var(--sub-alt)",
                          color: "var(--text)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--text)";
                          e.currentTarget.style.color = "var(--bg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--sub-alt)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                      >
                        Block
                      </button>
                      <button
                        className="px-3 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                          backgroundColor: "var(--sub-alt)",
                          color: "var(--text)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--text)";
                          e.currentTarget.style.color = "var(--bg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--sub-alt)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                      >
                        Underline
                      </button>
                    </div>
                  </div>

                  <div
                    className="border-t"
                    style={{ borderColor: "var(--bg)" }}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "var(--sub)" }}
                      >
                        Smooth Caret
                      </h3>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        Enable smooth caret movement animation
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        backgroundColor: "var(--sub-alt)",
                        color: "var(--text)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--text)";
                        e.currentTarget.style.color = "var(--bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--sub-alt)";
                        e.currentTarget.style.color = "var(--text)";
                      }}
                    >
                      On
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

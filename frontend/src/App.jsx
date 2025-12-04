import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar";
import Lazytype from "./pages/Lazytype";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import SupportModal from "./components/SupportModal";
import WorkingOnIt from "./pages/WorkingOnIt";
import LegalPages from "./pages/LegalPages";
import { updateFavicon } from "./utils/updateFavicon";
import { themes } from "./data/themes";
import { loadTheme, saveTheme } from "./utils/localStorage";

const App = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => loadTheme());

  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const isLegalPage =
    location.pathname === "/terms" || location.pathname === "/privacy";

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        if (key !== "name") {
          const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          document.documentElement.style.setProperty(cssVarName, value);
        }
      });

      updateFavicon();

      saveTheme(currentTheme);
    }
  }, [currentTheme]);

  return (
    <div
      className="flex flex-col min-h-screen antialiased transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {!isLegalPage && <Navbar isTyping={!showConfig && !isTestComplete} />}
      <main className="flex-grow flex justify-center">
        <div className="w-full">
          <div style={{ display: isHomePage ? "contents" : "none" }}>
            <Lazytype
              onShowConfigChange={setShowConfig}
              onTestCompleteChange={setIsTestComplete}
            />
          </div>

          {!isHomePage && (
            <Routes>
              <Route path="/leaderboard" element={<WorkingOnIt />} />
              <Route path="/profile" element={<WorkingOnIt />} />
              <Route path="/terms" element={<LegalPages />} />
              <Route path="/privacy" element={<LegalPages />} />
            </Routes>
          )}
        </div>
      </main>
      {!isLegalPage && (
        <Footer
          isTyping={!showConfig && !isTestComplete}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          currentThemeKey={currentTheme}
          setTheme={setCurrentTheme}
        />
      )}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;

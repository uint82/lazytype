import { useState } from "react";
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

const App = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const isLegalPage =
    location.pathname === "/terms" || location.pathname === "/privacy";

  return (
    <div className="flex flex-col min-h-screen bg-[#282828] antialiased">
      {!isLegalPage && <Navbar isTyping={!showConfig && !isTestComplete} />}
      <main className="flex-grow flex justify-center">
        <div className="w-full">
          <Routes>
            <Route
              path="/"
              element={
                <Lazytype
                  onShowConfigChange={setShowConfig}
                  onTestCompleteChange={setIsTestComplete}
                />
              }
            />
            <Route path="/leaderboard" element={<WorkingOnIt />} />
            <Route path="/profile" element={<WorkingOnIt />} />
            <Route path="/terms" element={<LegalPages />} />
            <Route path="/privacy" element={<LegalPages />} />
          </Routes>
        </div>
      </main>
      {!isLegalPage && (
        <Footer
          isTyping={!showConfig && !isTestComplete}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
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

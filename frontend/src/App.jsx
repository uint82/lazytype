import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Lazytype from "./pages/Lazytype";
import Footer from "./components/Footer";
import WorkingOnIt from "./pages/WorkingOnIt";

const App = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [isTestComplete, setIsTestComplete] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#282828] antialiased">
      <Navbar isTyping={!showConfig && !isTestComplete} />

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
          </Routes>
        </div>
      </main>

      <Footer isTyping={!showConfig && !isTestComplete} />
      <Analytics />
    </div>
  );
};

export default App;

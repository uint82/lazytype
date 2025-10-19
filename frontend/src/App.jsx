import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Lazytype from "./pages/Lazytype";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#282828] antialiased">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Lazytype />} />
            <Route path="/leaderboard" element={<p>Leaderboard Page</p>} />
            <Route path="/profile" element={<p>Profile Page</p>} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;

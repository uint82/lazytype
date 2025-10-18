import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-100">
      <Navbar />
      <div className="pt-16 px-4 flex-grow">
        <Routes>
          <Route
            path="/"
            element={<p className="underline">Main Typing Content</p>}
          />
          <Route path="/leaderboard" element={<p>Leaderboard Page</p>} />
          <Route path="/profile" element={<p>Profile Page</p>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

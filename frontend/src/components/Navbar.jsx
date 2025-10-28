import { Keyboard, Trophy, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ isTyping }) => {
  return (
    <nav className="w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition"
        >
          <Keyboard
            className={`w-10 h-10 transition-colors ${isTyping ? "text-[#635851]" : "text-[#D8AB19]"}`}
          />
          <span
            className={`font-semibold text-2xl hidden sm:inline custom-hide-text transition-colors ${isTyping ? "text-[#635851]" : "text-[#D6C7A3]"}`}
          >
            LazyType
          </span>
        </Link>

        <div
          className={`flex items-center space-x-6 text-[#ebdbb2] transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Link
            to="/leaderboard"
            className="flex items-center space-x-1 hover:text-[#fe8019] transition"
          >
            <Trophy size={22} />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>

          <Link to="/profile" className="hover:text-[#fe8019] transition">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

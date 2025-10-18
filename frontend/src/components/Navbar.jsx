import { Keyboard, Trophy, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-amber-100 shadow-md fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition"
        >
          <Keyboard className="w-7 h-7 text-blue-600" />
          <span className="font-semibold text-xl text-blue-600 hidden sm:inline custom-hide-text">
            LazyType
          </span>
        </Link>

        <div className="flex items-center space-x-6 text-gray-700">
          <Link
            to="/leaderboard"
            className="flex items-center space-x-1 hover:text-blue-600 transition"
          >
            <Trophy size={22} />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>

          <Link to="/profile" className="hover:text-blue-600 transition">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

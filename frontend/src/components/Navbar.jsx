import { Keyboard, Trophy, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ isTyping }) => {
  return (
    <nav className="content-grid z-20 top-0 left-0 py-2">
      <div className="py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition"
        >
          <Keyboard
            className="w-10 h-15 transition-colors"
            style={{
              color: isTyping ? "var(--text-dim)" : "var(--primary)",
            }}
          />
          <span
            className="font-semibold text-3xl hidden sm:inline custom-hide-text transition-colors"
            style={{
              color: isTyping ? "var(--text-dim)" : "var(--text-secondary)",
              fontFamily: "Lexend Deca",
            }}
          >
            lazytype
          </span>
        </Link>
        <div
          className={`flex items-center space-x-6 transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          style={{ color: "var(--text-primary)" }}
        >
          <Link
            to="/leaderboard"
            className="flex items-center space-x-1 transition"
            style={{ color: "var(--text-untyped)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-untyped)")
            }
          >
            <Trophy size={22} />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>
          <Link
            to="/profile"
            className="transition"
            style={{ color: "var(--text-untyped)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-untyped)")
            }
          >
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

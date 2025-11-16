import { Link } from "react-router-dom";

const Footer = ({ isTyping, onOpenContact, onOpenSupport }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`content-grid relative py-6 mt-34 transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="full-width absolute -top-10 left-1/2 transform -translate-x-1/2 text-[#d5c4a1] text-xs sm:text-sm">
        <span>
          <span className="bg-[#3c3836] text-[#ebdbb2] px-2 py-0.5 shadow-sm mx-0.5">
            Tab
          </span>
          +
          <span className="bg-[#3c3836] text-[#ebdbb2] px-2 py-0.5 shadow-sm mx-0.5">
            Enter
          </span>
          = restart test
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[#ebdbb2] text-sm">
        <div className="flex space-x-6 mb-3 sm:mb-0">
          <button
            onClick={onOpenContact}
            className="hover:text-[#fe8019] cursor-pointer transition"
          >
            Contact
          </button>

          <button
            onClick={onOpenSupport}
            className="hover:text-[#fe8019] cursor-pointer transition"
          >
            Support
          </button>

          <Link to="/terms" className="hover:text-[#fe8019] transition">
            Terms
          </Link>

          <Link to="/privacy" className="hover:text-[#fe8019] transition">
            Privacy
          </Link>
        </div>

        <p className="text-[#a89984]">
          {currentYear} inspired by{" "}
          <a
            href="https://monkeytype.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#fe8019] transition underline"
          >
            monkeytype
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

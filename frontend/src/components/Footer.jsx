import { Link } from "react-router-dom";

const Footer = ({ isTyping }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative py-4 mt-10 transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-[#d5c4a1] text-xs sm:text-sm">
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

      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-[#ebdbb2] text-sm">
        <div className="flex space-x-6 mb-3 sm:mb-0">
          <Link to="/contact" className="hover:text-[#fe8019] transition">
            Contact
          </Link>
          <Link to="/support" className="hover:text-[#fe8019] transition">
            Support
          </Link>
          <Link to="/terms" className="hover:text-[#fe8019] transition">
            Terms
          </Link>
        </div>
        <p className="text-[#a89984]">{currentYear} © Hilmi Abroor</p>
      </div>
    </footer>
  );
};

export default Footer;

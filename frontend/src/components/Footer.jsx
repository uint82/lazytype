import { Link } from "react-router-dom";
import { Mail, LifeBuoy, FileText, Shield } from "lucide-react";

const Footer = ({ isTyping, onOpenContact, onOpenSupport }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`content-grid relative py-6 mt-34 transition-opacity duration-300 ${isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="full-width absolute -top-10 left-1/2 transform -translate-x-1/2 text-[#d5c4a1] text-xs sm:text-sm">
        <span className="full-width text-[#665c54] flex items-center gap-2 whitespace-nowrap">
          <span className="bg-[#665c54] rounded text-black/60 px-2 py-0.1 shadow-sm mx-0.5">
            tab
          </span>
          +
          <span className="bg-[#665c54] rounded text-black/60 px-2 py-0.1 shadow-sm mx-0.5">
            Enter
          </span>
          -<span className="text-[#665c54]">restart test</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[#ebdbb2] text-sm">
        <div className="flex space-x-6 mb-3 sm:mb-0">
          <button
            onClick={onOpenContact}
            className="hover:text-white text-[#665c54] cursor-pointer transition flex items-center gap-1"
          >
            <Mail size={16} />
            contact
          </button>

          <button
            onClick={onOpenSupport}
            className="hover:text-white text-[#665c54] cursor-pointer transition flex items-center gap-1"
          >
            <LifeBuoy size={16} />
            support
          </button>

          <Link
            to="/terms"
            className="hover:text-white text-[#665c54] transition flex items-center gap-1"
          >
            <FileText size={16} />
            terms
          </Link>

          <Link
            to="/privacy"
            className="hover:text-white text-[#665c54] transition flex items-center gap-1"
          >
            <Shield size={16} />
            privacy
          </Link>
        </div>

        <p className="text-[#665c54]">
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

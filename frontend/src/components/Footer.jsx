import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-100 border-t border-gray-200 py-4 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-gray-700 text-sm">
        <div className="flex space-x-6 mb-3 sm:mb-0">
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
          <Link to="/support" className="hover:text-blue-600 transition">
            Support
          </Link>
          <Link to="/terms" className="hover:text-blue-600 transition">
            Terms
          </Link>
        </div>
        <p className="text-gray-500">{currentYear} © Hilmi Abroor</p>
      </div>
    </footer>
  );
};

export default Footer;

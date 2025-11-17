import { useState } from "react";
import { Languages } from "lucide-react";
import LanguageModal from "./LanguageModal";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const languages = [
    { id: "english", name: "english" },
    { id: "indonesian", name: "indonesian" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.id === selectedLanguage,
  );

  return (
    <div className="flex justify-center items-center mt-5">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 rounded text-[#635851] hover:text-[#D3869B] cursor-pointer transition-all flex items-center gap-3"
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        <Languages size={20} />
        <span>{currentLanguage?.name}</span>
      </button>

      {isModalOpen && (
        <LanguageModal
          languages={languages}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(langId) => {
            setSelectedLanguage(langId);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;

import { useState } from "react";
import { BookA } from "lucide-react";
import LanguageModal from "./LanguageModal";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const languages = [
    { id: "english", name: "English" },
    { id: "indonesian", name: "Indonesian" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.id === selectedLanguage,
  );

  return (
    <div className="flex justify-center items-center mt-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded text-[#ebdbb2] hover:text-[#D8AB19] transition-all flex items-center gap-2"
      >
        <BookA size={20} />
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

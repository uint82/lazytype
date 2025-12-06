import { useState } from "react";
import { Languages, ChartSpline } from "lucide-react";
import LanguageModal from "./LanguageModal";

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  isZenMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const languages = [
    { id: "english", name: "english" },
    { id: "indonesian", name: "indonesian" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.id === selectedLanguage,
  );

  if (isZenMode) {
    return (
      <div
        className="flex px-3 py-1 gap-3 justify-center items-center mt-5"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          color: "var(--sub)",
        }}
      >
        <ChartSpline size={20} />
        <span>shift + Enter to finish zen</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-5">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 rounded cursor-pointer transition-all flex items-center gap-3"
        style={{
          fontFamily: "'Roboto Mono', monospace",
          color: "var(--sub)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sub)")}
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

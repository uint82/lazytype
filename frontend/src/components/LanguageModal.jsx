import { createPortal } from "react-dom";

const LanguageModal = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleOverlayClick}
    >
      <div
        className="p-5 rounded-lg border-2 shadow-lg w-[90%] max-w-[320px] text-center"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
        }}
      >
        <h2
          className="text-lg font-medium mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Select Language
        </h2>

        <div className="flex flex-col gap-2">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => onSelectLanguage(language.id)}
              className="w-full px-4 py-2 rounded transition-all cursor-pointer"
              style={{
                backgroundColor:
                  selectedLanguage === language.id
                    ? "var(--secondary)"
                    : "var(--bg-secondary)",
                color:
                  selectedLanguage === language.id
                    ? "var(--bg-primary)"
                    : "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                if (selectedLanguage !== language.id) {
                  e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLanguage !== language.id) {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                }
              }}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LanguageModal;

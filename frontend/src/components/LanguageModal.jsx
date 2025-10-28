const LanguageModal = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#282828] p-5 rounded-lg shadow-lg w-[90%] max-w-[320px] text-center">
        <h2 className="text-lg font-medium text-[#ebdbb2] mb-4">
          Select Language
        </h2>

        <div className="flex flex-col gap-2">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => onSelectLanguage(language.id)}
              className={`w-full px-4 py-2 rounded transition-all ${selectedLanguage === language.id
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

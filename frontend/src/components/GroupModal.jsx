const GroupModal = ({ groups, selectedGroup, onSelect, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#282828] p-4 rounded-lg shadow-lg w-[50%] max-w-sm text-center overflow-hidden">
        <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {groups.map((group) => (
            <button
              key={group.index ?? "all"}
              onClick={() => onSelect(group.index)}
              className={`px-4 py-2 rounded transition-all ${selectedGroup === group.index
                  ? "bg-[#D8AB19] text-[#282828]"
                  : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
                }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupModal;

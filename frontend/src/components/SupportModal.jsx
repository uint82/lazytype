import { X, Heart } from "lucide-react";

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#282828] border-2 border-[#504945] rounded-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#504945]">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-[#fb4934]" />
            <h2 className="text-2xl font-bold text-[#ebdbb2]">
              Support Lazytype
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-[#a89984] hover:text-[#ebdbb2] cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-[#a89984] text-center leading-relaxed">
            Thank you so much for thinking about supporting this project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;

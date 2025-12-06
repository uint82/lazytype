import { X, Heart } from "lucide-react";

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="border-2 rounded-lg max-w-2xl w-full"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--sub-alt)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--sub-alt)" }}
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6" style={{ color: "var(--error)" }} />
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Support Lazytype
            </h2>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer transition-colors"
            style={{ color: "var(--sub)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sub)")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p
            className="text-center leading-relaxed"
            style={{ color: "var(--text)" }}
          >
            Thank you so much for thinking about supporting this project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;

import { X, Mail } from "lucide-react";

const ContactModal = ({ isOpen, onClose }) => {
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
            <Mail className="w-6 h-6" style={{ color: "var(--main)" }} />
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Contact
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
            Feel free to send an email to{" "}
            <span style={{ color: "var(--main)" }}>abroorhilmi@gmail.com</span>.
            <span style={{ color: "var(--text)" }}>
              (The buttons below will open the default mail client)
            </span>
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:abroorhilmi@gmail.com"
              className="w-full px-6 py-3 text-center font-semibold rounded transition-colors"
              style={{
                backgroundColor: "var(--sub-alt)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sub-alt)";
              }}
            >
              Question, Feedback, Bug Report, Account Help, ...
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

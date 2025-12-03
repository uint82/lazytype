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
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6" style={{ color: "var(--secondary)" }} />
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Contact
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p
            className="text-center leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Feel free to send an email to{" "}
            <span style={{ color: "var(--info)" }}>abroorhilmi@gmail.com</span>.
            <br />
            <br />
            <span style={{ color: "var(--text-untyped)" }}>
              (The buttons below will open the default mail client.)
            </span>
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:abroorhilmi@gmail.com"
              className="w-full px-6 py-3 text-center font-semibold rounded transition-colors"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--bg-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
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

import { X, Mail } from "lucide-react";

const ContactModal = ({ isOpen, onClose }) => {
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
            <Mail className="w-6 h-6 text-[#fabd2f]" />
            <h2 className="text-2xl font-bold text-[#ebdbb2]">Contact</h2>
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
            Feel free to send an email to{" "}
            <span className="text-[#83a598]">abroorhilmi@gmail.com</span>.
            <br />
            <br />
            <span className="text-[#665c54]">
              (The buttons below will open the default mail client.)
            </span>
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:abroorhilmi@gmail.com"
              className="w-full px-6 py-3 bg-[#fabd2f] text-[#282828] text-center font-semibold rounded hover:bg-[#d79921] transition-colors"
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

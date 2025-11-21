import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const NotificationSystem = ({
  notifications,
  removeNotification,
  isTyping,
}) => {
  const getIcon = (type) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
      case "notice":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case "error":
        return "Error";
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "info":
        return "Info";
      case "notice":
        return "Notice";
      default:
        return "Info";
    }
  };

  const getStyles = (type) => {
    const baseClasses =
      "flex items-center gap-3 px-5 py-3.5 rounded-md shadow-2xl border-l-4 backdrop-blur-sm animate-slide-in";
    switch (type) {
      case "error":
        return `${baseClasses} bg-[#3c1f1e]/95 border-[#fb4934] text-[#fb4934]`;
      case "success":
        return `${baseClasses} bg-[#2b3328]/95 border-[#b8bb26] text-[#b8bb26]`;
      case "warning":
        return `${baseClasses} bg-[#3c3028]/95 border-[#fabd2f] text-[#fabd2f]`;
      case "info":
      case "notice":
      default:
        return `${baseClasses} bg-[#2e3b3a]/95 border-[#8ec07c] text-[#8ec07c]`;
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-out {
          animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>
      <div
        className={`fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none transition-opacity duration-500 ${isTyping ? "opacity-0" : "opacity-100"
          }`}
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${getStyles(notif.type)} pointer-events-auto min-w-[320px] max-w-[420px]`}
          >
            <div className="flex-shrink-0">{getIcon(notif.type)}</div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[#ebdbb2] text-sm font-semibold">
                {getTitle(notif.type)}
              </span>
              <span className="text-[#a89984] text-sm leading-relaxed">
                {notif.message}
              </span>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="flex-shrink-0 text-[#a89984] hover:text-[#ebdbb2] transition-all duration-200 hover:rotate-90 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationSystem;

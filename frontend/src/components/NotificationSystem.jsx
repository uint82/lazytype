import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const NotificationSystem = ({
  notifications,
  removeNotification,
  isTyping,
}) => {
  const getIcon = (type) => {
    switch (type) {
      case "error":
        return (
          <AlertCircle className="w-5 h-5" style={{ color: "var(--error)" }} />
        );
      case "success":
        return (
          <CheckCircle
            className="w-5 h-5"
            style={{ color: "var(--success)" }}
          />
        );
      case "warning":
        return (
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: "var(--warning)" }}
          />
        );
      case "info":
      case "notice":
      default:
        return <Info className="w-5 h-5" style={{ color: "var(--info)" }} />;
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
    const base = {
      backgroundColor: "var(--bg-primary-alpha)",
      color: "var(--text-primary)",
      borderLeft: "4px solid var(--accent)",
    };

    switch (type) {
      case "error":
        return {
          ...base,
          borderLeft: "4px solid var(--error)",
          color: "var(--error)",
        };
      case "success":
        return {
          ...base,
          borderLeft: "4px solid var(--success)",
          color: "var(--success)",
        };
      case "warning":
        return {
          ...base,
          borderLeft: "4px solid var(--warning)",
          color: "var(--warning)",
        };
      case "info":
      case "notice":
        return {
          ...base,
          borderLeft: "4px solid var(--info)",
          color: "var(--info)",
        };
      default:
        return base;
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-out { animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards; }
      `}</style>

      <div
        className={`fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none transition-opacity duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`}
      >
        {notifications.map((notif) => {
          const style = getStyles(notif.type);
          return (
            <div
              key={notif.id}
              className="flex items-center gap-3 px-5 py-3.5 rounded-md shadow-2xl backdrop-blur-sm animate-slide-in pointer-events-auto min-w-[320px] max-w-[420px]"
              style={style}
            >
              <div className="flex-shrink-0">{getIcon(notif.type)}</div>

              <div className="flex-1 flex flex-col gap-1">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {getTitle(notif.type)}
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {notif.message}
                </span>
              </div>

              <button
                onClick={() => removeNotification(notif.id)}
                className="flex-shrink-0 p-1 transition-all duration-200 hover:rotate-90"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationSystem;

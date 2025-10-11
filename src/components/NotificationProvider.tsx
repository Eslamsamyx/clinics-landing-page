import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X, AlertCircle } from "lucide-react";

type NotificationType = "success" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (type: NotificationType, message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, type, message }]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    },
    [removeNotification]
  );

  const success = useCallback(
    (message: string) => {
      addNotification("success", message);
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string) => {
      addNotification("error", message);
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider value={{ success, error }}>
      {children}

      {/* Notification Container */}
      <div className="pointer-events-none fixed right-0 top-0 z-[9999] flex flex-col items-end gap-4 p-6">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="pointer-events-auto"
            >
              <div
                className="flex min-w-[320px] max-w-md items-start gap-4 rounded-2xl p-5 shadow-2xl backdrop-blur-md"
                style={{
                  background:
                    notification.type === "success"
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)"
                      : "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {notification.type === "success" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium leading-relaxed text-white">
                    {notification.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

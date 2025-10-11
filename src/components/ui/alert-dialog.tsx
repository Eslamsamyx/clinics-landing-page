import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "./button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant?: "success" | "error" | "info";
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = "info",
}: AlertDialogProps) {
  const variantStyles = {
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              dir="rtl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${styles.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${styles.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {description}
                </p>

                {/* Action */}
                <Button
                  onClick={onClose}
                  className={`w-full ${styles.button}`}
                >
                  حسناً
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  allowScroll?: boolean; // New prop to allow scrolling
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  allowScroll = false, // Default to false for backward compatibility
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Determine width based on size prop
  const getWidth = () => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-2xl";
      case "lg":
        return "max-w-4xl";
      case "xl":
        return "max-w-6xl";
      case "full":
        return "max-w-[90%] max-h-[90%]";
      default:
        return "max-w-2xl";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 ${getWidth()} w-full ${
              allowScroll || size === "full"
                ? "overflow-auto"
                : "overflow-hidden"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-gray-800 dark:text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Optional title */}
            {title && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className={title ? "p-6" : "p-0"}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

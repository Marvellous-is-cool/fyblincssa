import React from "react";
import { motion } from "framer-motion";

interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  characterCount?: boolean;
  maxLength?: number;
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  icon,
  characterCount,
  maxLength,
  className = "",
  value = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
          className={`
            w-full p-3 border-2 border-gray-300 rounded-xl 
            focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 
            outline-none bg-white shadow-lg font-semibold text-gray-800 
            transition-all duration-300 placeholder-gray-400
            ${icon ? "pl-10" : ""}
            ${className}
          `}
          value={value}
          maxLength={maxLength}
          {...(props as any)}
        />

        {characterCount && maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
            {String(value).length}/{maxLength} characters
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedInput;

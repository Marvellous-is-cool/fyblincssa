"use client";

import { motion } from "framer-motion";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
};

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    "rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-primary/40 shadow-md hover:shadow-lg",
    secondary:
      "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary/40 shadow-md hover:shadow-lg",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30",
    ghost:
      "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/20",
  };

  const sizeStyles = {
    sm: "text-sm py-1.5 px-3 gap-1.5",
    md: "text-base py-2 px-4 gap-2",
    lg: "text-lg py-3 px-6 gap-2.5",
  };

  const disabledStyles =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer";

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span>{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
}

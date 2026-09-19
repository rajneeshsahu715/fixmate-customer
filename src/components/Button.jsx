import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",

    secondary:
      "border border-slate-300 bg-white text-text-primary hover:bg-slate-50 focus:ring-slate-400",

    accent:
      "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",

    danger:
      "bg-error text-white hover:bg-red-700 focus:ring-red-500",

    ghost:
      "bg-transparent text-text-secondary hover:bg-slate-100 hover:text-text-primary focus:ring-slate-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
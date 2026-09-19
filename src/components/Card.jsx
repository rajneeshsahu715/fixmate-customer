import React from "react";

const Card = ({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverStyles = hover
    ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    : "";

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        border border-slate-200
        bg-surface
        shadow-sm
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
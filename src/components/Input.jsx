import React from "react";
import { AlertCircle } from "lucide-react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  helperText = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-text-primary"
        >
          {label}

          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        className={`
          w-full rounded-xl border bg-white px-4 py-3
          text-sm text-text-primary
          placeholder:text-slate-400
          outline-none
          transition-all duration-200
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-500
          ${
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          }
        `}
        {...props}
      />

      {error && (
        <div
          id={`${inputId}-error`}
          className="mt-2 flex items-center gap-1.5 text-sm text-error"
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-xs text-text-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
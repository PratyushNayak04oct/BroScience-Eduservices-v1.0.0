"use client";

import { cn } from "@/lib/utils";

const stateStyles = {
  default:
    "border-[var(--border)] bg-[var(--surface)] focus-within:border-[var(--brand-gold)]",
  focused:
    "border-[var(--brand-gold)] bg-[var(--surface)] ring-2 ring-[var(--brand-gold)]/20",
  error:
    "border-red-500/70 bg-red-500/5 focus-within:border-red-500 focus-within:ring-red-500/20",
};

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  state = "default",
  placeholder,
  required = false,
  as = "input",
  rows = 4,
  options = [],
  className,
  disabled = false,
}) {
  const fieldState = error ? "error" : state;
  const wrapperClass = cn(
    "rounded-xl border px-4 py-3 transition-all duration-200",
    stateStyles[fieldState],
    disabled && "opacity-60"
  );

  const inputClass =
    "w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none disabled:cursor-not-allowed";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-[var(--foreground)]">
          {label}
          {required && <span className="ml-1 text-[var(--brand-gold)]">*</span>}
        </label>
      )}

      <div className={wrapperClass}>
        {as === "textarea" ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value || ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={cn(inputClass, "resize-y min-h-[120px]")}
          />
        ) : as === "select" ? (
          <select
            id={name}
            name={name}
            value={value || ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={cn(inputClass, "cursor-pointer")}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value || ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClass}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormStatus({ status, successMessage, failureMessage }) {
  if (status === "success") {
    return (
      <div
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
        role="status"
      >
        {successMessage || "Thank you! Your submission was received successfully."}
      </div>
    );
  }

  if (status === "failure") {
    return (
      <div
        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300"
        role="alert"
      >
        {failureMessage || "Something went wrong. Please try again in a moment."}
      </div>
    );
  }

  return null;
}

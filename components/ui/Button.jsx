"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--brand-gold)] text-[var(--brand-black)] border border-[var(--brand-gold)] hover:bg-[#d4b45c] hover:border-[#d4b45c] shadow-[0_8px_24px_rgba(201,168,77,0.22)]",
  secondary:
    "bg-[var(--surface)]/70 text-[var(--foreground)] border border-[var(--border-strong)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] backdrop-blur-md",
  maroon:
    "bg-[var(--brand-maroon)] text-[var(--brand-white)] border border-[var(--brand-maroon)] hover:bg-[#7d2430] hover:border-[#7d2430]",
};

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  type = "button",
  disabled = false,
  icon,
}) {
  const classes = cn(
    "group relative z-20 inline-flex min-h-11 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide",
    "pointer-events-auto touch-manipulation cursor-pointer",
    "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className
  );

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {icon && <span className="relative shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
      <ArrowIcon className="relative shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1" />
    </>
  );

  const handleClick = (event) => {
    onClick?.(event);
    if (!href || event.defaultPrevented || isModifiedClick(event) || disabled) return;

    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const startPath = window.location.pathname;
    window.setTimeout(() => {
      if (window.location.pathname === startPath && destination.pathname !== startPath) {
        window.location.assign(destination.pathname + destination.search + destination.hash);
      }
    }, 350);
  };

  if (href) {
    return (
      <Link href={href} className={classes} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

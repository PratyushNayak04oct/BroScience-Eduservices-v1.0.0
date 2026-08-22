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
    "pointer-events-auto touch-manipulation",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0",
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

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
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

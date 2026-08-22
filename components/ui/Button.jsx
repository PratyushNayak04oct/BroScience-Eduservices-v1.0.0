"use client";

import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

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
  const ref = useRef(null);

  const onMove = (event) => {
    if (prefersReducedMotion() || disabled) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate3d(0, 0, 0)";
  };

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-wide",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out will-change-transform",
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
      <Link
        ref={ref}
        href={href}
        className={classes}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {content}
    </button>
  );
}

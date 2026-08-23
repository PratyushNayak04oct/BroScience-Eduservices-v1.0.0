"use client";

import { useRef } from "react";
import Link from "next/link";
import { canFinePointer, cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/gsap";

const variants = {
  primary:
    "bg-[var(--brand-gold)] text-[var(--brand-black)] border border-[var(--brand-gold)] hover:bg-[#e0b31f] hover:border-[#e0b31f] shadow-[0_8px_24px_rgba(212,160,23,0.2)]",
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
  const magnetRef = useRef(null);

  const onMagnetMove = (event) => {
    if (prefersReducedMotion() || disabled || !canFinePointer()) return;
    const node = magnetRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    node.style.transition = "none";
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onMagnetLeave = () => {
    const node = magnetRef.current;
    if (!node) return;
    node.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
    node.style.transform = "translate3d(0, 0, 0)";
  };

  const isFullWidth = typeof className === "string" && className.includes("w-full");

  const classes = cn(
    "group relative z-20 inline-flex min-h-11 max-w-full items-center justify-center gap-2.5 overflow-hidden rounded-full px-5 py-3 text-sm font-medium tracking-wide sm:px-6",
    "pointer-events-auto touch-manipulation cursor-pointer",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out",
    "active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className
  );

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {icon && <span className="relative shrink-0">{icon}</span>}
      <span className="relative min-w-0 text-center">{children}</span>
      <ArrowIcon className="relative shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
    </>
  );

  const magnet = (node) => (
    <span
      ref={magnetRef}
      className={cn("inline-flex max-w-full will-change-transform", isFullWidth && "w-full")}
      onMouseMove={onMagnetMove}
      onMouseLeave={onMagnetLeave}
    >
      {node}
    </span>
  );

  if (href) {
    return magnet(
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return magnet(
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

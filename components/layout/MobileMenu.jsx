"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";

function CloseIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function MobileMenu({ id, isOpen, onClose, links, pathname }) {
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    initGsap();

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([backdrop, panel], { opacity: 1, x: 0 });
      closeButtonRef.current?.focus();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { x: "100%" });

      const tl = gsap.timeline({
        onComplete: () => closeButtonRef.current?.focus(),
      });

      tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(panel, { x: "0%", duration: 0.45, ease: "power3.out" }, "-=0.15");
    });

    return () => ctx.revert();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    previousFocusRef.current?.focus?.();
  }, [isOpen]);

  const handleClose = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const reduced = prefersReducedMotion();

    if (reduced || !panel || !backdrop) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panel, { x: "100%", duration: 0.35, ease: "power3.in" })
      .to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.1");
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-[60] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <button
        ref={backdropRef}
        type="button"
        className="absolute inset-0 bg-[var(--brand-black)]/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close menu"
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col",
          "border-l border-[var(--border)] bg-[var(--background)]/92 shadow-2xl backdrop-blur-2xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <span className="flex items-center gap-3">
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-[var(--brand-gold)]/40">
              <Image src="/brand/logo.png" alt="" fill sizes="36px" className="object-cover" />
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Menu
            </span>
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)]",
              "text-[var(--foreground)] transition-colors hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            )}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Mobile">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleClose}
              className={cn(
                "rounded-xl px-4 py-3.5 text-lg font-medium tracking-wide transition-colors",
                isActive(link.href)
                  ? "bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]"
                  : "text-[var(--foreground)] hover:bg-[var(--surface)]"
              )}
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-[var(--border)] px-6 py-6">
          <ThemeToggle className="self-start" />
          <Button href="/contact" onClick={handleClose} className="w-full justify-center">
            Book Free Counselling
          </Button>
        </div>
      </div>
    </div>
  );
}

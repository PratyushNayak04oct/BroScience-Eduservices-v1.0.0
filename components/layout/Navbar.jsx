"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Doubts", href: "/doubts" },
  { label: "Library", href: "/library" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

function MenuIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const readY = () => window.__bsLenis?.scroll ?? window.scrollY ?? 0;
    const handleScroll = () => setScrolled(readY() > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const lenis = window.__bsLenis;
    lenis?.on("scroll", handleScroll);
    const poll = window.setInterval(() => {
      if (window.__bsLenis && window.__bsLenis !== lenis) {
        window.__bsLenis.on("scroll", handleScroll);
        window.clearInterval(poll);
      }
    }, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.__bsLenis?.off("scroll", handleScroll);
      lenis?.off("scroll", handleScroll);
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const bar = (
    <>
      <header
        className={cn(
          "bs-navbar",
          scrolled ? "bs-navbar-scrolled" : "bs-navbar-top"
        )}
      >
        <nav
          className="mx-auto flex h-[4.25rem] w-full min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:h-[4.5rem] sm:gap-6 sm:px-8"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2 text-[var(--foreground)] sm:gap-3"
            aria-label="BroScience Eduservices home"
          >
            <span className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-[var(--brand-gold)]/40 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/brand/logo.png"
                alt="BroScience Eduservices"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-sm font-semibold tracking-tight">BroScience</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Eduservices
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group/nav relative px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 hover:-translate-y-px",
                  isActive(link.href)
                    ? "text-[var(--brand-gold)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-[var(--brand-gold)] transition-transform duration-300",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="relative z-50 flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button href="/contact" className="hidden md:inline-flex !px-5 !py-2.5 !text-xs">
              Book Free Counselling
            </Button>
            <button
              type="button"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] lg:hidden",
                "bg-[var(--surface)]/80 text-[var(--foreground)] backdrop-blur-md",
                "transition-all duration-300 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
              )}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        id="mobile-menu"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        pathname={pathname}
      />
    </>
  );

  if (!mounted) return bar;
  return createPortal(bar, document.body);
}

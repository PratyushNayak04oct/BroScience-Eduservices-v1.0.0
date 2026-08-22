import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import CampusMap from "./CampusMap";
import { cn } from "@/lib/utils";

const footerLinks = {
  explore: [
    { label: "Courses", href: "/courses" },
    { label: "Library", href: "/library" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Blogs", href: "/blogs" },
  ],
  support: [
    { label: "Doubts", href: "/doubts" },
    { label: "Contact Us", href: "/contact" },
    { label: "Book Counselling", href: "/contact" },
    { label: "FAQs", href: "/#faqs" },
  ],
};

export default function Footer({ className }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-[var(--border)] bg-[var(--background)]", className)}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-semibold tracking-tight">
              <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-[var(--brand-gold)]/35">
                <Image src="/brand/logo.png" alt="BroScience Eduservices" fill sizes="48px" className="object-cover" />
              </span>
              BroScience
            </Link>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--muted)]">
              Premium education services crafted for ambitious learners. Expert guidance,
              curated resources, and a community built for excellence.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Explore
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="editorial-link text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="editorial-link text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <GlassCard className="p-6 lg:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>
                <span className="block text-[var(--foreground)]">Email</span>
                hello@broscience.edu
              </li>
              <li>
                <span className="block text-[var(--foreground)]">Phone</span>
                +91 98765 43210
              </li>
              <li>
                <span className="block text-[var(--foreground)]">Campus</span>
                BRO SCIENCE INSTITUTE
              </li>
            </ul>
          </GlassCard>
        </div>

        <div className="mt-14">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                Visit us
              </p>
              <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
                BRO SCIENCE INSTITUTE
              </h3>
            </div>
            <Link
              href="/contact"
              className="editorial-link hidden text-sm text-[var(--muted)] sm:inline-flex"
            >
              Get directions
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] shadow-[0_18px_40px_rgba(10,10,10,0.06)]">
            <CampusMap className="h-64 w-full sm:h-80" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">
            &copy; {year} BroScience Eduservices. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--muted)]">
            <Link href="/privacy" className="transition-colors hover:text-[var(--foreground)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--foreground)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

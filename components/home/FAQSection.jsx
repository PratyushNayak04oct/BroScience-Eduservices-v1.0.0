"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";
import { gsap, initGsap, prefersReducedMotion } from "@/lib/gsap";

function FAQItem({ faq, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    initGsap();

    if (prefersReducedMotion()) {
      content.style.height = isOpen ? "auto" : "0px";
      return;
    }

    if (isOpen) {
      gsap.set(content, { height: "auto" });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[var(--border)]">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:text-[var(--brand-gold)]"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium tracking-tight text-[var(--foreground)]">
          {faq.question}
        </span>
        <span
          className={cn(
            "mt-1 shrink-0 font-mono text-sm text-[var(--brand-gold)] transition-transform duration-300",
            isOpen && "rotate-45"
          )}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div ref={innerRef} className="pb-6 pr-8">
          <p className="text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p>
          <span className="mt-3 inline-block text-xs uppercase tracking-[0.15em] text-[var(--brand-gold)]/60">
            {faq.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    initGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faqs" className="relative border-t border-[var(--border)] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          number="11"
          eyebrow="Questions"
          title="Common questions, clear answers."
          align="center"
          className="mb-16 lg:mb-20"
        />

        <div>
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

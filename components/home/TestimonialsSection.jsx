"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const scrollRef = useRef(null);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,rgba(201,168,77,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Voices"
          title="What students and parents say."
          description="These quotes are sample copy for layout only — not verified testimonials."
          className="mb-16 lg:mb-24"
        />

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="w-[85vw] shrink-0 sm:w-[28rem] lg:w-[32rem]"
            >
              <blockquote>
                <p className="text-2xl font-medium leading-snug tracking-tight text-[var(--foreground)] sm:text-3xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="h-px w-8 bg-[var(--brand-gold)]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {testimonial.role} · {testimonial.course}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--muted)]">
          Scroll to read more →
        </p>
      </div>
    </section>
  );
}

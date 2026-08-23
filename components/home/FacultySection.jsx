"use client";

import { useState } from "react";
import { faculty } from "@/data/faculty";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export default function FacultySection() {
  const [activeId, setActiveId] = useState(faculty[0].id);
  const featured = faculty.find((member) => member.id === activeId) ?? faculty[0];

  return (
    <section className="py-32 sm:py-40 lg:py-48">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            number="03"
            eyebrow="The People"
            title="Learn from specialists who teach with purpose"
            description="Faculty profiles below are placeholders until verified names and portraits are supplied."
            className="mb-16 lg:mb-24"
          />
        </Reveal>

        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
          <Reveal>
            <article className="group">
              <div className="relative aspect-[4/5] max-h-[36rem] overflow-hidden border border-[var(--border)] bg-[linear-gradient(160deg,rgba(107,20,32,0.88),rgba(20,17,14,0.92))]">
                <div
                  className="absolute inset-0 opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 42%, rgba(212,160,23,0.28), transparent 46%)",
                  }}
                  aria-hidden="true"
                />
                <svg
                  className="absolute left-1/2 top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-[var(--brand-gold)]"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <polygon
                    points="50,6 93,28 93,72 50,94 7,72 7,28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="22"
                    fontFamily="serif"
                  >
                    BS
                  </text>
                </svg>
                <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.22em] text-[var(--brand-white)]/70">
                  Portrait placeholder
                </p>
              </div>
            </article>
          </Reveal>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--brand-gold)]">
              {featured.subjects.join(" · ")}
            </p>
            <h3 className="mt-5 break-words font-display text-[clamp(1.8rem,6vw,3.6rem)] leading-[1.05] text-[var(--foreground)]">
              {featured.name}
            </h3>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--muted)]">
              {featured.philosophy}
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-8 border-t border-[var(--border)] pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Experience</dt>
                <dd className="mt-2 text-sm text-[var(--foreground)]">{featured.experience}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Credential</dt>
                <dd className="mt-2 text-sm text-[var(--foreground)]">{featured.qualification}</dd>
              </div>
            </dl>

            <ul className="mt-14 space-y-0 border-t border-[var(--border)]">
              {faculty.slice(0, 4).map((member) => {
                const isActive = member.id === featured.id;
                return (
                  <li key={member.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(member.id)}
                      className={cn(
                        "group/faculty relative flex w-full min-w-0 items-baseline justify-between gap-3 border-b border-[var(--border)] py-5 text-left transition-all duration-300 sm:gap-6",
                        isActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <span className="min-w-0 truncate font-display text-lg sm:text-xl">{member.name}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-[var(--brand-gold)] sm:text-xs">
                        {member.subjects[0]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

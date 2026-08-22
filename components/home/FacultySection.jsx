import { faculty } from "@/data/faculty";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

export default function FacultySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            number="03"
            eyebrow="The People"
            eyebrow="Faculty"
            title="Learn from specialists who teach with purpose"
            description="Our faculty bring years of classroom experience and a shared commitment to making complex subjects accessible."
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.slice(0, 3).map((member, index) => (
            <Reveal key={member.id} delay={index * 0.08}>
              <GlassCard className="flex h-full flex-col gap-5 p-6">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--brand-maroon)]/30 to-[var(--brand-gold)]/20" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{member.name}</h3>
                  <p className="mt-1 text-sm text-[var(--brand-gold)]">
                    {member.subjects.join(" · ")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {member.philosophy}
                  </p>
                </div>
                <p className="mt-auto text-xs text-[var(--muted)]">
                  {member.experience} · {member.qualification}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

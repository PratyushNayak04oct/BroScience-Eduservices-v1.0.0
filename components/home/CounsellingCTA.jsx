import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function CounsellingCTA() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-sm px-5 py-12 sm:px-12 sm:py-24 lg:px-20 lg:py-28">
            {/* Atmospheric accents */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--brand-gold)]/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--brand-maroon)]/8 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <SectionHeading
                  number="10"
                  eyebrow="The Decision"
                  title="Not sure where to start?"
                  description="Book a free counselling session with our academic advisors. We'll help you choose the right course, batch, and study plan — no obligation."
                />
              </div>

              <div className="flex flex-col gap-6 lg:items-end">
                <ul className="space-y-3 text-sm text-[var(--muted)] lg:text-right">
                  <li>Personalised course recommendation</li>
                  <li>Batch and schedule guidance</li>
                  <li>Parent and student Q&A</li>
                </ul>
                <Button href="/contact" variant="maroon" className="lg:self-end">
                  Book Free Counselling
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

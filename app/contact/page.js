import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/ui/Reveal";
import CampusMap from "@/components/layout/CampusMap";

const contactInfo = [
  {
    label: "Email",
    value: "hello@broscience-edu.com",
    note: "We respond within 24 hours",
  },
  {
    label: "Phone",
    value: "+91 98765 43210",
    note: "Mon–Sat, 9 AM – 7 PM IST",
  },
  {
    label: "Address",
    value: "BRO SCIENCE INSTITUTE",
    note: "Campus location",
  },
];

export const metadata = {
  title: "Contact Us — BroScience Eduservices",
  description:
    "Get in touch for course enquiries, free counselling, admissions, and partnerships. We're here to help students and parents.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's start a conversation"
            description="Whether you're exploring courses, booking counselling, or have a question — our team is ready to help."
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-8">
            <Reveal>
              <div className="grid gap-4">
                {contactInfo.map((item) => (
                  <GlassCard key={item.label} interactive intensity={0.75} className="p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--muted)]">
                      {item.label}
                    </p>
                    <p className="mt-2 font-medium text-[var(--foreground)]">{item.value}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.note}</p>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <GlassCard className="overflow-hidden p-0">
                <CampusMap className="aspect-[16/10] h-auto w-full" />
              </GlassCard>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-wrap gap-4">
                <Button href="/courses">Explore Courses</Button>
                <Button href="/doubts" variant="secondary">
                  Doubt Support
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <GlassCard className="p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Send us a message</h2>
              <ContactForm />
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

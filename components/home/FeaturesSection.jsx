import SectionHeading from "@/components/ui/SectionHeading";
import FeatureTile from "@/components/home/FeatureTile";
import { features } from "@/data/features";

export default function FeaturesSection() {
  return (
    <section className="relative border-y border-[var(--border)] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          number="06"
          eyebrow="The Platform"
          title="Everything a serious student needs."
          description="Nine pillars of our learning ecosystem — integrated, not bolted on."
          className="mb-16 lg:mb-20"
        />

        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureTile key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import { courses } from "@/data/courses";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — BroScience Eduservices`,
    description: `${course.duration} ${course.mode} program covering ${course.subjects.join(", ")}. Starting at ${formatPrice(course.fee)}.`,
  };
}

function DetailList({ title, items }) {
  return (
    <GlassCard className="p-6 sm:p-8">
      <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-gold)]" />
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const installmentAmount = Math.ceil(course.fee / course.installments);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={course.category}
            title={course.title}
            description={`${course.duration} · ${course.mode} · Faculty: ${course.faculty}`}
            className="mb-12"
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal>
              <GlassCard className="p-6 sm:p-8">
                <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Overview</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Duration" value={course.duration} />
                  <InfoItem label="Mode" value={course.mode} />
                  <InfoItem label="Faculty" value={course.faculty} />
                  <InfoItem label="Installments" value={`${course.installments} × ${formatPrice(installmentAmount)}`} />
                </div>
                <div className="mt-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-[var(--muted)]">
                    Subjects
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--foreground)]"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.08}>
              <DetailList title="Program Features" items={course.features} />
            </Reveal>
            <Reveal delay={0.12}>
              <DetailList title="Curriculum" items={course.curriculum} />
            </Reveal>
            <Reveal delay={0.16}>
              <DetailList title="Assessment" items={course.assessment} />
            </Reveal>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={0.1}>
              <GlassCard className="sticky top-28 flex flex-col gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-sm text-[var(--muted)]">Total Fee</p>
                  <p className="mt-1 text-3xl font-semibold text-[var(--foreground)]">
                    {formatPrice(course.fee)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    or {course.installments} installments of {formatPrice(installmentAmount)}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button href={`/courses/${course.slug}`}>View Details</Button>
                  <Button href="/contact" variant="maroon">
                    Enroll Now
                  </Button>
                  <Button href="/contact" variant="secondary">
                    Book Free Demo
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--foreground)]">{value}</p>
    </div>
  );
}

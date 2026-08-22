import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CourseCard({ course }) {
  return (
    <GlassCard interactive className="flex h-full flex-col gap-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
          {course.category}
        </span>
        <span className="text-xs font-medium text-[var(--brand-gold)]">{course.mode}</span>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold leading-snug text-[var(--foreground)]">
          {course.title}
        </h3>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {course.duration} · {course.subjects.slice(0, 3).join(", ")}
          {course.subjects.length > 3 && " +more"}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-5">
        <div>
          <p className="text-xs text-[var(--muted)]">Starting from</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatPrice(course.fee)}
          </p>
        </div>
        <Button href={`/courses/${course.slug}`} className="!px-4 !py-2 !text-xs">
          View Details
        </Button>
      </div>
    </GlassCard>
  );
}

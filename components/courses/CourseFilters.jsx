"use client";

import { cn } from "@/lib/utils";

export default function CourseFilters({
  categories,
  modes,
  selectedCategory,
  selectedMode,
  onCategoryChange,
  onModeChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="course-search" className="sr-only">
          Search courses
        </label>
        <input
          id="course-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses by name or subject..."
          className={cn(
            "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none",
            "transition-colors focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
          )}
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={!selectedCategory}
            onClick={() => onCategoryChange("")}
          />
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Mode
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={!selectedMode} onClick={() => onModeChange("")} />
          {modes.map((mode) => (
            <FilterChip
              key={mode}
              label={mode}
              active={selectedMode === mode}
              onClick={() => onModeChange(mode)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
      )}
    >
      {label}
    </button>
  );
}

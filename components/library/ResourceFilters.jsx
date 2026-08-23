"use client";

import { cn } from "@/lib/utils";

export default function ResourceFilters({
  categories,
  subjects,
  accessTypes,
  selectedCategory,
  selectedSubject,
  selectedAccess,
  onCategoryChange,
  onSubjectChange,
  onAccessChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, subject, or keyword..."
          className={cn(
            "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none",
            "transition-all duration-200 focus:-translate-y-px focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
          )}
        />
      </div>

      <FilterGroup label="Category" options={categories} selected={selectedCategory} onChange={onCategoryChange} />
      <FilterGroup label="Subject" options={subjects} selected={selectedSubject} onChange={onSubjectChange} />
      <FilterGroup label="Access" options={accessTypes} selected={selectedAccess} onChange={onAccessChange} />
    </div>
  );
}

function FilterGroup({ label, options, selected, onChange }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" active={!selected} onClick={() => onChange("")} />
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            active={selected === option}
            onClick={() => onChange(option)}
          />
        ))}
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
        "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
        "hover:scale-[1.04] active:scale-[0.96]",
        active
          ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
      )}
    >
      {label}
    </button>
  );
}

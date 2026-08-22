"use client";

import { useMemo, useState } from "react";
import { resources } from "@/data/resources";
import SectionHeading from "@/components/ui/SectionHeading";
import ResourceCard from "@/components/library/ResourceCard";
import ResourceFilters from "@/components/library/ResourceFilters";
import Reveal from "@/components/ui/Reveal";

const categories = [...new Set(resources.map((r) => r.category))];
const subjects = [...new Set(resources.map((r) => r.subject))];
const accessTypes = ["Free", "Premium"];

export default function LibraryListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAccess, setSelectedAccess] = useState("");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return resources.filter((resource) => {
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
      const matchesAccess =
        !selectedAccess ||
        (selectedAccess === "Free" && resource.isFree) ||
        (selectedAccess === "Premium" && !resource.isFree);
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.subject.toLowerCase().includes(query);
      return matchesCategory && matchesSubject && matchesAccess && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedSubject, selectedAccess]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Digital Library"
            title="Study materials curated by experts"
            description="Download notes, formula sheets, practice papers, and study tools — free and premium resources for every subject."
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <aside>
            <ResourceFilters
              categories={categories}
              subjects={subjects}
              accessTypes={accessTypes}
              selectedCategory={selectedCategory}
              selectedSubject={selectedSubject}
              selectedAccess={selectedAccess}
              onCategoryChange={setSelectedCategory}
              onSubjectChange={setSelectedSubject}
              onAccessChange={setSelectedAccess}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </aside>

          <div>
            <p className="mb-6 text-sm text-[var(--muted)]">
              Showing {filtered.length} of {resources.length} resources
            </p>
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-[var(--border)] p-12 text-center text-[var(--muted)]">
                No resources match your filters.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((resource, index) => (
                  <Reveal key={resource.id} delay={index * 0.03}>
                    <ResourceCard resource={resource} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

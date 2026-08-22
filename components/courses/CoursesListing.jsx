"use client";

import { useMemo, useState } from "react";
import { courses } from "@/data/courses";
import SectionHeading from "@/components/ui/SectionHeading";
import CourseCard from "@/components/courses/CourseCard";
import CourseFilters from "@/components/courses/CourseFilters";
import Reveal from "@/components/ui/Reveal";

const categories = [...new Set(courses.map((c) => c.category))];
const modes = [...new Set(courses.map((c) => c.mode))];

export default function CoursesListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return courses.filter((course) => {
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesMode = !selectedMode || course.mode === selectedMode;
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.subjects.some((s) => s.toLowerCase().includes(query)) ||
        course.category.toLowerCase().includes(query);
      return matchesCategory && matchesMode && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedMode]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Programs"
            title="Courses built for every academic goal"
            description="From school foundations to JEE, NEET, and board excellence — find the program that fits your journey."
            className="mb-16"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <aside>
            <CourseFilters
              categories={categories}
              modes={modes}
              selectedCategory={selectedCategory}
              selectedMode={selectedMode}
              onCategoryChange={setSelectedCategory}
              onModeChange={setSelectedMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </aside>

          <div>
            <p className="mb-6 text-sm text-[var(--muted)]">
              Showing {filtered.length} of {courses.length} courses
            </p>
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-[var(--border)] p-12 text-center text-[var(--muted)]">
                No courses match your filters. Try adjusting your search.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((course, index) => (
                  <Reveal key={course.slug} delay={index * 0.04}>
                    <CourseCard course={course} />
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

import Hero from "@/components/home/Hero";
import PhilosophySection from "@/components/home/PhilosophySection";
import FacultySection from "@/components/home/FacultySection";
import DoubtSection from "@/components/home/DoubtSection";
import MentorshipSection from "@/components/home/MentorshipSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import LibraryPreview from "@/components/home/LibraryPreview";
import EcosystemSection from "@/components/home/EcosystemSection";
import BlogPreview from "@/components/home/BlogPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CounsellingCTA from "@/components/home/CounsellingCTA";
import FAQSection from "@/components/home/FAQSection";

export const metadata = {
  title: "BroScience Eduservices | Home",
  description:
    "Structured courses, expert faculty, doubt support, and mentorship for Class 7 through JEE, NEET, and board excellence.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhilosophySection />
      <FacultySection />
      <DoubtSection />
      <MentorshipSection />
      <FeaturesSection />
      <StatsSection />
      <LibraryPreview />
      <EcosystemSection />
      <BlogPreview />
      <TestimonialsSection />
      <CounsellingCTA />
      <FAQSection />
    </>
  );
}

"use client";

import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";
import { useLoader } from "@/components/loading/LoaderProvider";

export default function AppShell({ children }) {
  const { hasEntered } = useLoader();

  return (
    <>
      <Navbar />
      <SmoothScroll>
        <div className={`min-w-0 ${hasEntered ? "bs-app-visible" : "bs-app-pending"}`}>{children}</div>
      </SmoothScroll>
    </>
  );
}

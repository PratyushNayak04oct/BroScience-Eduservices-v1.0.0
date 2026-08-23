"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }) {
  const pathname = usePathname();

  return (
    <div data-page={pathname} className="min-w-0">
      {children}
    </div>
  );
}

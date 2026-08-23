"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import BroScienceLoader from "./BroScienceLoader";
import ScientificCursor from "./ScientificCursor";
import { prefersReducedMotion } from "@/lib/gsap";

const LoaderContext = createContext({
  hasEntered: false,
  isLoaderVisible: true,
});

export function useLoader() {
  return useContext(LoaderContext);
}

export default function LoaderProvider({ children }) {
  const pathname = usePathname();
  const firstPath = useRef(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [playId, setPlayId] = useState(0);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    setPlayId((value) => value + 1);
    setIsLoaderVisible(true);
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ hasEntered, isLoaderVisible }}>
      {isLoaderVisible && (
        <BroScienceLoader
          key={playId}
          waitForBook={pathname === "/" && playId === 0}
          onRevealSite={() => setHasEntered(true)}
          onComplete={() => setIsLoaderVisible(false)}
        />
      )}
      <ScientificCursor enabled />
      <div className={hasEntered ? "bs-app-visible" : "bs-app-pending"}>{children}</div>
    </LoaderContext.Provider>
  );
}

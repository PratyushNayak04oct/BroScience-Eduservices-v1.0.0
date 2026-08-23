"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import BroScienceLoader from "./BroScienceLoader";
import RouteTransition from "./RouteTransition";
import ScientificCursor from "./ScientificCursor";

const LoaderContext = createContext({
  hasEntered: false,
  isLoaderVisible: true,
});

export function useLoader() {
  return useContext(LoaderContext);
}

export default function LoaderProvider({ children }) {
  const pathname = usePathname();
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  return (
    <LoaderContext.Provider value={{ hasEntered, isLoaderVisible }}>
      {isLoaderVisible && (
        <BroScienceLoader
          waitForBook={pathname === "/"}
          onRevealSite={() => setHasEntered(true)}
          onComplete={() => setIsLoaderVisible(false)}
        />
      )}
      <RouteTransition enabled={hasEntered} />
      <ScientificCursor enabled />
      <div className={hasEntered ? "bs-app-visible" : "bs-app-pending"}>{children}</div>
    </LoaderContext.Provider>
  );
}

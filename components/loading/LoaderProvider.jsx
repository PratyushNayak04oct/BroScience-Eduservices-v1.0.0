"use client";

import { createContext, useContext, useState } from "react";
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
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  return (
    <LoaderContext.Provider value={{ hasEntered, isLoaderVisible }}>
      {isLoaderVisible && (
        <BroScienceLoader
          onRevealSite={() => setHasEntered(true)}
          onComplete={() => setIsLoaderVisible(false)}
        />
      )}
      <RouteTransition enabled={hasEntered} />
      <ScientificCursor enabled={hasEntered} />
      {children}
    </LoaderContext.Provider>
  );
}

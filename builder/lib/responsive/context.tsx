"use client";

import * as React from "react";
import type { Breakpoint } from "@/components/editor/breakpoint-selector";

interface ResponsiveContextValue {
  breakpoint: Breakpoint;
  isBuilder: boolean; // Only builder tier can set responsive overrides
}

const ResponsiveContext = React.createContext<ResponsiveContextValue>({
  breakpoint: "desktop",
  isBuilder: false,
});

export function ResponsiveProvider({
  breakpoint,
  isBuilder,
  children,
}: {
  breakpoint: Breakpoint;
  isBuilder: boolean;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ breakpoint, isBuilder }),
    [breakpoint, isBuilder],
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveContext() {
  return React.useContext(ResponsiveContext);
}

export function useCurrentBreakpoint() {
  return React.useContext(ResponsiveContext).breakpoint;
}

export function useCanSetResponsiveOverrides() {
  return React.useContext(ResponsiveContext).isBuilder;
}

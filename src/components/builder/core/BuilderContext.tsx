import React, { createContext, useContext } from "react";
import type { Data } from "@measured/puck";

export interface BuilderContextType {
  website: any;
  setWebsite: (w: any) => void;
  pages: any[];
  setPages: (p: any[]) => void;
  activePageSlug: string;
  setActivePageSlug: (s: string) => void;
  puckData: Data;
  setPuckData: (d: Data) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  device: "desktop" | "tablet" | "mobile";
  setDevice: (d: "desktop" | "tablet" | "mobile") => void;
  zoom: number;
  setZoom: (z: number) => void;
  saving: boolean;
  setSaving: (s: boolean) => void;
  preferences: { grid: boolean; snap: boolean; guides: boolean };
  setPreferences: (p: any) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within a BuilderProvider");
  return ctx;
}

export function BuilderProvider({ children, value }: { children: React.ReactNode; value: BuilderContextType }) {
  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

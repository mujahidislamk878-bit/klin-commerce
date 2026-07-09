import React from "react";
import { useBuilder } from "../core/BuilderContext";

export function CanvasOverlay({ children }: { children: React.ReactNode }) {
  const { preferences } = useBuilder();
  return (
    <div className="relative w-full h-full">
      {preferences.grid && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      )}
      {children}
    </div>
  );
}

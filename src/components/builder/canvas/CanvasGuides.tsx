import React from "react";
import { useBuilder } from "../core/BuilderContext";

export function CanvasGuides() {
  const { preferences, selectedNodeId } = useBuilder();
  if (!preferences.guides || !selectedNodeId) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-indigo-400/35" />
    </div>
  );
}

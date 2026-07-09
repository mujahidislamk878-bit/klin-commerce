import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { Activity, Cpu } from "lucide-react";

export function BuilderStatusBar() {
  const { website, puckData } = useBuilder();
  const componentCount = puckData?.content?.length || 0;

  return (
    <footer className="h-8 bg-white border-t border-black/5 flex items-center justify-between px-6 text-[10px] font-medium text-[#0F1020]/50 select-none shrink-0 font-sans">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-emerald-500" />
          Status: Live Workspace
        </span>
        <span>•</span>
        <span>Site ID: {website?._id || "klin-dev"}</span>
      </div>

      <div className="flex items-center gap-3">
        <span>Components: {componentCount}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          Engine: Headless Puck Abstraction
        </span>
      </div>
    </footer>
  );
}

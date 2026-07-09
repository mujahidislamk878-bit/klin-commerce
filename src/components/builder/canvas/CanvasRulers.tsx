import React from "react";

export function CanvasRulers() {
  return (
    <div className="h-4 bg-neutral-100 border-b border-black/5 flex items-center justify-between text-[8px] font-mono text-neutral-400 px-4 select-none shrink-0">
      <span>0px</span>
      <span>200px</span>
      <span>400px</span>
      <span>600px</span>
      <span>800px</span>
      <span>1000px</span>
      <span>1200px</span>
    </div>
  );
}

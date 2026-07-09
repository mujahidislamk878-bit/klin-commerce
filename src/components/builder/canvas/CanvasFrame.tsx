import React from "react";

export function CanvasFrame({ children, width }: { children: React.ReactNode; width: string }) {
  return (
    <div className="flex-1 flex justify-center overflow-auto p-8 bg-[#EEF0F5] transition-all">
      <div 
        className="bg-white shadow-xl border border-black/5 rounded-2xl overflow-hidden transition-all duration-300 h-fit min-h-[600px]"
        style={{ width, maxWidth: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}

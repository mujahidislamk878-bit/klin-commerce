import React from "react";
import { useBuilder } from "../core/BuilderContext";

export function ThemeStudio() {
  const { website, setWebsite } = useBuilder();
  const theme = website?.theme || {
    primaryColor: "#6366F1",
    accentColor: "#6366F1",
    bgColor: "#ffffff",
    fgColor: "#0F1020"
  };

  const handleColorChange = (key: string, value: string) => {
    setWebsite({
      ...website,
      theme: {
        ...theme,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Theme Studio</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Customize global storefront branding colors.</p>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-[#0F1020]/80">
        {[
          { key: "primaryColor", label: "Primary Brand Color" },
          { key: "accentColor", label: "Accent Highlight Color" },
          { key: "bgColor", label: "Background Theme Color" },
          { key: "fgColor", label: "Foreground Text Color" }
        ].map((item) => (
          <div key={item.key} className="space-y-1">
            <label>{item.label}</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={theme[item.key] || "#6366F1"}
                onChange={(e) => handleColorChange(item.key, e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer"
              />
              <input
                type="text"
                value={theme[item.key] || "#6366F1"}
                onChange={(e) => handleColorChange(item.key, e.target.value)}
                className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs font-mono font-normal"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

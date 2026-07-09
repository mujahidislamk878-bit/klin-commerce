import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export function CanvasViewport() {
  const { device, setDevice, zoom, setZoom } = useBuilder();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 bg-[#0F1020]/5 p-1 rounded-full">
        {([
          { id: "desktop", icon: Monitor },
          { id: "tablet", icon: Tablet },
          { id: "mobile", icon: Smartphone }
        ] as const).map((d) => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              className={`p-1.5 rounded-full transition ${
                device === d.id ? "bg-white text-[#0F1020] shadow-sm" : "text-[#0F1020]/45"
              }`}
              title={`${d.id} viewport`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[#0F1020]/50 font-mono">
        <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="hover:text-[#0F1020] px-1 font-bold">-</button>
        <span>{zoom}%</span>
        <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="hover:text-[#0F1020] px-1 font-bold">+</button>
      </div>
    </div>
  );
}

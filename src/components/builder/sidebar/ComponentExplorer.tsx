import React from "react";
import { ComponentRegistry } from "../../../packages/registry/ComponentRegistry";
import { Box, Monitor, Menu, Grid, Image, MessageSquare, Tag, HelpCircle, Play, Download, ShoppingBag, LayoutGrid, Percent } from "lucide-react";

export function ComponentExplorer() {
  const components = ComponentRegistry.getComponents();

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type, component: type }));
  };

  const getLucideIcon = (name: string) => {
    switch (name) {
      case "Monitor": return Monitor;
      case "Menu": return Menu;
      case "Grid": return Grid;
      case "Image": return Image;
      case "MessageSquare": return MessageSquare;
      case "Tag": return Tag;
      case "HelpCircle": return HelpCircle;
      case "Play": return Play;
      case "Download": return Download;
      case "ShoppingBag": return ShoppingBag;
      case "LayoutGrid": return LayoutGrid;
      case "Percent": return Percent;
      default: return Box;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Components Library</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Drag blocks onto the canvas area to build.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {components.map((c) => {
          const Icon = getLucideIcon(c.icon);
          return (
            <div
              key={c.type}
              draggable
              onDragStart={(e) => handleDragStart(e, c.type)}
              className="p-3 bg-white border border-black/5 hover:border-black/10 hover:shadow-sm rounded-xl cursor-grab transition active:cursor-grabbing flex flex-col items-center justify-between h-20 text-center select-none"
            >
              <Icon className="h-4.5 w-4.5 text-[#0F1020]/60 mt-1" />
              <span className="text-[10px] font-bold text-[#0F1020]/80 tracking-wide font-sans">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

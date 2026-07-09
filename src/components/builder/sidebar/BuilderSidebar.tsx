import React, { useState } from "react";
import { ComponentExplorer } from "./ComponentExplorer";
import { PagesPanel } from "./PagesPanel";
import { LayersPanel } from "./LayersPanel";
import { ThemeStudio } from "./ThemeStudio";
import { AssetManager } from "./AssetManager";
import { DataSourcesPanel } from "./DataSourcesPanel";
import { Grid, FileText, Layers, Palette, Image, Database } from "lucide-react";

export function BuilderSidebar({ onAddPage, onDeletePage }: { onAddPage: () => void; onDeletePage: (slug: string) => void }) {
  const [activeTab, setActiveTab] = useState<"components" | "pages" | "layers" | "theme" | "assets" | "bindings">("components");

  const tabs = [
    { id: "components", label: "Components", icon: Grid },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "layers", label: "Layers", icon: Layers },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "assets", label: "Assets", icon: Image },
    { id: "bindings", label: "Data Sources", icon: Database }
  ] as const;

  return (
    <aside className="w-80 border-r border-black/5 bg-[#F8F9FB] flex h-full text-[#0F1020] shrink-0 overflow-hidden">
      {/* Icon Tab Bar */}
      <div className="w-16 border-r border-black/5 flex flex-col items-center py-4 justify-between bg-white select-none shrink-0 h-full">
        <div className="space-y-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 rounded-xl transition ${
                  isActive ? "bg-[#0F1020] text-white shadow-sm" : "text-[#0F1020]/45 hover:text-black hover:bg-neutral-50"
                }`}
                title={tab.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Pane content drawer */}
      <div className="flex-1 p-6 overflow-y-auto h-full">
        {activeTab === "components" && <ComponentExplorer />}
        {activeTab === "pages" && <PagesPanel onAddPage={onAddPage} onDeletePage={onDeletePage} />}
        {activeTab === "layers" && <LayersPanel />}
        {activeTab === "theme" && <ThemeStudio />}
        {activeTab === "assets" && <AssetManager />}
        {activeTab === "bindings" && <DataSourcesPanel />}
      </div>
    </aside>
  );
}

import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { CanvasViewport } from "../canvas/CanvasViewport";
import { HistoryService } from "../services/HistoryService";
import { Save, Globe, Undo2, Redo2, Settings, ArrowLeft } from "lucide-react";

export function BuilderToolbar({
  onPublish,
  onSaveAsTemplate,
  onSaveDirectly,
  onOpenSiteManager,
  isTemplate,
  savingState
}: {
  onPublish?: () => void;
  onSaveAsTemplate?: () => void;
  onSaveDirectly?: () => void;
  onOpenSiteManager?: () => void;
  isTemplate: boolean;
  savingState: boolean;
}) {
  const { website, activePageSlug, pages, setActivePageSlug, setPuckData, puckData } = useBuilder();

  const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    setActivePageSlug(slug);
    const target = pages.find((p) => p.slug === slug);
    if (target?.builderJson) setPuckData(target.builderJson);
  };

  return (
    <header className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-6 select-none shrink-0 text-[#0F1020]">
      <div className="flex items-center gap-4">
        <a href="/dashboard" className="p-1.5 hover:bg-neutral-100 rounded-xl transition text-[#0F1020]/50">
          <ArrowLeft className="h-4 w-4" />
        </a>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0F1020] flex items-center justify-center text-white font-black text-sm tracking-tighter">
            K
          </div>
          <div>
            <h1 className="text-xs font-bold font-sans tracking-wide leading-none">{website?.name || "Klin Store"}</h1>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#0F1020]/40 leading-none">
              Visual Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-4 bg-[#0F1020]/5 px-2.5 py-1.5 rounded-xl border border-black/5">
          <span className="text-[10px] font-bold text-[#0F1020]/45 uppercase font-mono">Page:</span>
          <select
            value={activePageSlug}
            onChange={handlePageSelect}
            className="bg-transparent text-xs font-bold font-sans text-[#0F1020] focus:outline-none cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
          {onOpenSiteManager && (
            <button
              onClick={onOpenSiteManager}
              className="p-1 hover:bg-[#0F1020]/10 rounded-lg text-[#0F1020]/60 transition"
              title="Site settings"
            >
              <Settings className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <CanvasViewport />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 border-r border-black/5 pr-3">
          <button
            onClick={() => HistoryService.undo(puckData, setPuckData)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-[#0F1020]/50 hover:text-black transition"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => HistoryService.redo(puckData, setPuckData)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-[#0F1020]/50 hover:text-black transition"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="text-[10px] font-mono text-[#0F1020]/45">
          {savingState ? "Saving..." : "Saved"}
        </span>

        {isTemplate ? (
          <button
            onClick={onSaveDirectly}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm font-sans"
          >
            <Save className="h-3.5 w-3.5" />
            Save Template
          </button>
        ) : (
          <>
            <button
              onClick={onSaveAsTemplate}
              className="px-4 py-2 bg-white border border-black/5 hover:bg-neutral-100 transition text-[#0F1020] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm font-sans"
            >
              <Save className="h-3.5 w-3.5" />
              Save as Template
            </button>

            <button
              onClick={onPublish}
              className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm font-sans"
            >
              <Globe className="h-3.5 w-3.5" />
              Publish
            </button>
          </>
        )}
      </div>
    </header>
  );
}

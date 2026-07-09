import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { Plus, FileText, Trash2 } from "lucide-react";

export function PagesPanel({ onAddPage, onDeletePage }: { onAddPage: () => void; onDeletePage: (slug: string) => void }) {
  const { pages, activePageSlug, setActivePageSlug, setPuckData } = useBuilder();

  const handleSelect = (p: any) => {
    setActivePageSlug(p.slug);
    if (p.builderJson) {
      setPuckData(p.builderJson);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Pages Manager</h3>
          <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Manage page links and custom slugs.</p>
        </div>
        <button
          onClick={onAddPage}
          className="p-1 hover:bg-neutral-100 rounded-lg text-[#0F1020]/60 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        {pages.map((p) => (
          <div
            key={p.slug}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activePageSlug === p.slug
                ? "bg-[#0F1020] text-white shadow-sm"
                : "text-[#0F1020]/60 hover:bg-neutral-50 hover:text-black"
            }`}
          >
            <button
              onClick={() => handleSelect(p)}
              className="flex-1 flex items-center gap-2 text-left truncate font-sans"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{p.title}</span>
              <span className="text-[9px] opacity-50 font-mono">/{p.slug}</span>
            </button>

            {p.slug !== "home" && (
              <button
                onClick={() => onDeletePage(p.slug)}
                className={`p-1 rounded hover:bg-red-500 hover:text-white transition ${
                  activePageSlug === p.slug ? "text-white/60" : "text-red-500/80"
                }`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

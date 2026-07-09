import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { Layers, ChevronUp, ChevronDown } from "lucide-react";

export function LayersPanel() {
  const { puckData, setPuckData, selectedNodeId, setSelectedNodeId } = useBuilder();
  const items = puckData?.content || [];

  const handleMove = (e: React.MouseEvent, index: number, direction: "up" | "down") => {
    e.stopPropagation();
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < items.length) {
      const nextContent = [...items];
      const [moved] = nextContent.splice(index, 1);
      nextContent.splice(target, 0, moved);
      setPuckData({ ...puckData, content: nextContent });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Layers Tree</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Select blocks to reorder or configure.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 text-xs font-semibold">
          No components on this page yet.
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((node, index) => {
            const isSelected = selectedNodeId === node.props?.id;
            return (
              <div
                key={node.props?.id || index}
                onClick={() => setSelectedNodeId(node.props?.id || null)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  isSelected
                    ? "bg-[#0F1020]/5 border border-black/5 text-[#0F1020]"
                    : "text-[#0F1020]/60 hover:bg-neutral-50 hover:text-black border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate font-sans">
                  <Layers className="h-3.5 w-3.5 opacity-55" />
                  <span className="truncate">{node.type}</span>
                  <span className="text-[8px] opacity-40 font-mono">#{node.props?.id?.substring(0, 6)}</span>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={(e) => handleMove(e, index, "up")}
                      className="p-1 hover:bg-neutral-100 disabled:opacity-30 rounded transition text-[#0F1020]"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      disabled={index === items.length - 1}
                      onClick={(e) => handleMove(e, index, "down")}
                      className="p-1 hover:bg-neutral-100 disabled:opacity-30 rounded transition text-[#0F1020]"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

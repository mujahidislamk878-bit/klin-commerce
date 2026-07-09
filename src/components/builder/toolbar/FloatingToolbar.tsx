import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { ClipboardService } from "../services/ClipboardService";
import { Copy, Trash2 } from "lucide-react";

export function FloatingToolbar() {
  const { selectedNodeId, puckData, setPuckData, setSelectedNodeId } = useBuilder();
  const selectedNode = (puckData?.content || []).find((node: any) => node.props?.id === selectedNodeId);

  if (!selectedNode) return null;

  const handleDelete = () => {
    const nextContent = (puckData?.content || []).filter((node: any) => node.props?.id !== selectedNodeId);
    setPuckData({ ...puckData, content: nextContent });
    setSelectedNodeId(null);
  };

  const handleDuplicate = () => {
    ClipboardService.duplicate(selectedNode, { puckData, setPuckData, setSelectedNodeId });
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#0F1020] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3.5 z-[999] select-none text-xs font-semibold border border-white/10">
      <span className="text-[10px] font-mono text-white/50">{selectedNode.type}</span>
      <div className="w-[1px] h-3 bg-white/10" />

      <button onClick={handleDuplicate} className="hover:text-neutral-200 flex items-center gap-1">
        <Copy className="h-3.5 w-3.5" />
        Duplicate
      </button>

      <button onClick={handleDelete} className="hover:text-red-400 flex items-center gap-1 text-red-500">
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    </div>
  );
}

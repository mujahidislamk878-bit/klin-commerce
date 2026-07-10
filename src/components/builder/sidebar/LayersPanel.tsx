import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { 
  Layers, 
  ChevronUp, 
  ChevronDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit2
} from "lucide-react";

export function LayersPanel() {
  const { puckData, setPuckData, selectedNodeId, setSelectedNodeId } = useBuilder();
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editLabel, setEditLabel] = React.useState<string>("");
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

  const handleLockToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const nextContent = [...items];
    const isLocked = nextContent[index].props?.locked;
    nextContent[index] = {
      ...nextContent[index],
      props: { ...nextContent[index].props, locked: !isLocked }
    };
    setPuckData({ ...puckData, content: nextContent });
  };

  const handleHideToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const nextContent = [...items];
    const isHidden = nextContent[index].props?.hidden;
    nextContent[index] = {
      ...nextContent[index],
      props: { ...nextContent[index].props, hidden: !isHidden }
    };
    setPuckData({ ...puckData, content: nextContent });
  };

  const handleDuplicate = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const sourceNode = items[index];
    const duplicatedNode = {
      ...sourceNode,
      props: {
        ...sourceNode.props,
        id: `node-${Math.random().toString(36).substr(2, 9)}`,
      }
    };
    const nextContent = [...items];
    nextContent.splice(index + 1, 0, duplicatedNode);
    setPuckData({ ...puckData, content: nextContent });
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const nextContent = items.filter((_, i) => i !== index);
    setPuckData({ ...puckData, content: nextContent });
    if (selectedNodeId === items[index].props?.id) {
      setSelectedNodeId(null);
    }
  };

  const startRename = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditLabel(items[index].props?.customLabel || items[index].type);
  };

  const saveRename = (index: number) => {
    const nextContent = [...items];
    nextContent[index] = {
      ...nextContent[index],
      props: { ...nextContent[index].props, customLabel: editLabel }
    };
    setPuckData({ ...puckData, content: nextContent });
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4 text-xs">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Layers Tree</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Select blocks to duplicate, rename, or reorder.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 text-xs font-semibold">
          No components on this page yet.
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((node, index) => {
            const isSelected = selectedNodeId === node.props?.id;
            const isLocked = node.props?.locked;
            const isHidden = node.props?.hidden;
            const customLabel = node.props?.customLabel;

            return (
              <div
                key={node.props?.id || index}
                onClick={() => setSelectedNodeId(node.props?.id || null)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none group border ${
                  isSelected
                    ? "bg-[#0F1020]/5 border-black/5 text-[#0F1020]"
                    : "text-[#0F1020]/60 hover:bg-neutral-50 hover:text-black border-transparent"
                } ${isHidden ? "opacity-45" : ""}`}
              >
                <div className="flex items-center gap-2 truncate font-sans flex-1">
                  <Layers className="h-3.5 w-3.5 opacity-55 shrink-0" />
                  
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editLabel}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setEditLabel(e.target.value)}
                      onBlur={() => saveRename(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(index);
                      }}
                      autoFocus
                      className="bg-white px-1.5 py-0.5 rounded border border-black/10 text-xs focus:outline-none w-full font-sans"
                    />
                  ) : (
                    <span 
                      onDoubleClick={(e) => startRename(e, index)}
                      className="truncate font-sans font-semibold tracking-wide"
                      title="Double click to rename"
                    >
                      {customLabel || node.type}
                    </span>
                  )}
                  {isLocked && <Lock className="h-3 w-3 text-red-500 shrink-0" />}
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 select-none">
                  {/* Lock action */}
                  <button
                    onClick={(e) => handleLockToggle(e, index)}
                    title={isLocked ? "Unlock Component" : "Lock Component"}
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition"
                  >
                    {isLocked ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3" />}
                  </button>

                  {/* Hide action */}
                  <button
                    onClick={(e) => handleHideToggle(e, index)}
                    title={isHidden ? "Show Component" : "Hide Component"}
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition"
                  >
                    {isHidden ? <EyeOff className="h-3 w-3 text-indigo-500" /> : <Eye className="h-3 w-3" />}
                  </button>

                  {/* Duplicate action */}
                  <button
                    onClick={(e) => handleDuplicate(e, index)}
                    title="Duplicate Component"
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition"
                  >
                    <Copy className="h-3 w-3" />
                  </button>

                  {/* Rename action toggle */}
                  <button
                    onClick={(e) => startRename(e, index)}
                    title="Rename Component"
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>

                  {/* Move Up action */}
                  <button
                    disabled={index === 0}
                    onClick={(e) => handleMove(e, index, "up")}
                    title="Move Layer Up"
                    className="p-1 hover:bg-neutral-100 disabled:opacity-30 rounded transition text-neutral-400 hover:text-neutral-600"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>

                  {/* Move Down action */}
                  <button
                    disabled={index === items.length - 1}
                    onClick={(e) => handleMove(e, index, "down")}
                    title="Move Layer Down"
                    className="p-1 hover:bg-neutral-100 disabled:opacity-30 rounded transition text-neutral-400 hover:text-neutral-600"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* Delete action */}
                  <button
                    onClick={(e) => handleDelete(e, index)}
                    title="Delete Component"
                    className="p-1 hover:bg-neutral-100 rounded text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

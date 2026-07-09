import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { MetadataRegistry } from "../../../packages/registry/MetadataRegistry";
import { ControlFactory } from "./ControlFactory";
import { Settings, Info } from "lucide-react";

export function PropertyInspector() {
  const { puckData, selectedNodeId, setPuckData } = useBuilder();
  const selectedNode = (puckData?.content || []).find((node: any) => node.props?.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-black/5 bg-white p-6 flex flex-col items-center justify-center text-center text-neutral-400 font-medium select-none shrink-0 h-full">
        <Info className="h-6 w-6 opacity-35 mb-2.5" />
        <p className="text-xs max-w-[180px] font-sans">Select any component on the canvas to configure properties.</p>
      </aside>
    );
  }

  const fields = MetadataRegistry.getFieldsMetadata(selectedNode.type);
  const handlePropChange = (fieldKey: string, val: any) => {
    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === selectedNodeId) {
        return {
          ...node,
          props: {
            ...node.props,
            [fieldKey]: val
          }
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
  };

  return (
    <aside className="w-80 border-l border-black/5 bg-white flex flex-col shrink-0 h-full overflow-hidden text-[#0F1020]">
      <div className="p-6 border-b border-black/5 flex items-center gap-2 select-none">
        <Settings className="h-4.5 w-4.5 text-[#0F1020]/60" />
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/75 font-bold">{selectedNode.type} Settings</h3>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {Object.keys(fields).length === 0 ? (
          <div className="text-xs text-neutral-400 font-semibold text-center py-6">
            No properties configurable for this block.
          </div>
        ) : (
          Object.entries(fields).map(([key, field]) => (
            <ControlFactory
              key={key}
              type={field.type}
              label={field.label}
              value={selectedNode.props?.[key] ?? field.default}
              onChange={(nextVal) => handlePropChange(key, nextVal)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

import React from "react";
import { RenderContext } from "./RenderContext";
import { puckConfigBuilder } from "../../lib/puck-config-builder";

export interface WebsiteRendererProps {
  context: RenderContext;
}

export function WebsiteRenderer({ context }: WebsiteRendererProps) {
  const blocks = context.page?.layout?.content || [];

  return (
    <div 
      className={`site-renderer-container ${context.direction === "RTL" ? "rtl" : "ltr"} ${
        context.device === "Mobile" ? "max-w-[375px] mx-auto border-x border-black/10" :
        context.device === "Tablet" ? "max-w-[768px] mx-auto border-x border-black/10" : ""
      }`} 
      dir={context.direction.toLowerCase()}
      style={{
        backgroundColor: context.theme?.colors?.background || "#ffffff",
        color: context.theme?.colors?.foreground || "#0f172a",
        fontFamily: context.theme?.fonts?.body || "Inter"
      }}
    >
      {blocks.map((block: any, idx: number) => {
        const compType = block.type;
        const compDef = puckConfigBuilder.components[compType as keyof typeof puckConfigBuilder.components];
        
        if (!compDef || !compDef.render) {
          console.warn(`Unresolved block type: ${compType}`);
          return (
            <div 
              key={block.id || idx} 
              className="p-8 border-2 border-dashed border-red-200 text-center text-xs text-red-500 bg-red-50/50 rounded-2xl m-4 font-mono"
            >
              ⚠️ Component definition mapping not found: "{compType}"
            </div>
          );
        }

        try {
          // Render block using exact Puck render templates, injecting resolved props
          return (
            <div key={block.id || idx} className="component-resolved-node">
              {(compDef.render as any)(block.props)}
            </div>
          );
        } catch (err: any) {
          console.error(`Error rendering block of type '${compType}':`, err);
          return (
            <div 
              key={block.id || idx} 
              className="p-8 border-2 border-dashed border-amber-200 text-center text-xs text-amber-600 bg-amber-50/50 rounded-2xl m-4 font-mono"
            >
              ⚠️ Critical rendering error in "{compType}": {err.message}
            </div>
          );
        }
      })}
    </div>
  );
}
export default WebsiteRenderer;

import React from "react";
import { BindingRegistry } from "../../../packages/registry/BindingRegistry";
import { Copy } from "lucide-react";

export function DataSourcesPanel() {
  const variables = BindingRegistry.getVariables();

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`{{${path}}}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Data Sources</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Reference dynamic variable expressions in property fields.</p>
      </div>

      <div className="space-y-3.5">
        {["Products", "CMS", "Global Settings", "Customer"].map((catName) => {
          const catVars = variables.filter((v) => v.category === catName);
          if (catVars.length === 0) return null;
          return (
            <div key={catName} className="space-y-2">
              <h4 className="text-[9px] uppercase font-mono tracking-wider text-[#0F1020]/40 font-bold">{catName} Variables</h4>
              <div className="space-y-1">
                {catVars.map((v) => (
                  <div
                    key={v.path}
                    className="flex justify-between items-center bg-neutral-50 border border-black/5 rounded-xl px-3 py-2 text-xs text-[#0F1020]/80"
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="font-semibold text-[10px] truncate">{v.label}</div>
                      <div className="font-mono text-[9px] text-indigo-600 truncate">{`{{${v.path}}}`}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(v.path)}
                      className="p-1 hover:bg-neutral-100 rounded text-[#0F1020]/50 hover:text-black transition shrink-0"
                      title="Copy Expression Path"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

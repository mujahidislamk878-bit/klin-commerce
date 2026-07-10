import React from "react";

export function ControlFactory({
  type,
  label,
  value,
  onChange,
  options
}: {
  type: string;
  label: string;
  value: any;
  onChange: (nextVal: any) => void;
  options?: { label: string; value: any }[];
}) {
  switch (type) {
    case "textarea":
      return (
        <div className="space-y-1 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
            rows={3}
          />
        </div>
      );
    case "color":
      return (
        <div className="space-y-1 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={value || "#6366F1"}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded border-none cursor-pointer"
            />
            <input
              type="text"
              value={value || "#6366F1"}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs font-mono font-normal"
            />
          </div>
        </div>
      );
    case "product":
      const mockProducts = [
        { id: "p_1", name: "Premium Knit Crewneck ($89)" },
        { id: "p_2", name: "Heavyweight Linen Trouser ($120)" },
        { id: "p_3", name: "Classic Minimalist Trainer ($160)" },
        { id: "p_4", name: "Tech Utility Overcoat ($240)" },
      ];
      return (
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
          >
            <option value="">Select Product...</option>
            {mockProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      );
    case "select":
      // Render short option lists (<= 5 items) as visual segmented buttons
      if (options && options.length <= 5) {
        return (
          <div className="space-y-1.5 text-xs text-left">
            <label className="font-semibold text-[#0F1020]/60">{label}</label>
            <div className="flex bg-neutral-100 rounded-lg p-0.5 gap-0.5 select-none">
              {options.map((opt) => {
                const isActive = String(value) === String(opt.value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 py-1 rounded text-[10px] font-semibold transition ${
                      isActive 
                        ? "bg-white text-indigo-600 shadow-sm font-bold" 
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-1 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <select
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "true") onChange(true);
              else if (val === "false") onChange(false);
              else onChange(val);
            }}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
          >
            {options ? (
              options.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))
            ) : (
              <>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </>
            )}
          </select>
        </div>
      );
    case "object":
    case "array":
      return (
        <div className="space-y-1 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label} (JSON)</label>
          <textarea
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || ""}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch (err) {
                // Ignore parse errors and let the user continue typing
              }
            }}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs font-mono focus:outline-none focus:border-indigo-500 font-sans"
            rows={5}
          />
        </div>
      );
    default:
      return (
        <div className="space-y-1 text-xs text-left">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>
      );
  }
}
export default ControlFactory;

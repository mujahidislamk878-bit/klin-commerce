import React from "react";

export function ControlFactory({
  type,
  label,
  value,
  onChange
}: {
  type: string;
  label: string;
  value: any;
  onChange: (nextVal: any) => void;
}) {
  switch (type) {
    case "textarea":
      return (
        <div className="space-y-1 text-xs">
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
        <div className="space-y-1 text-xs">
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
    case "select":
      return (
        <div className="space-y-1 text-xs">
          <label className="font-semibold text-[#0F1020]/60">{label}</label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      );
    default:
      return (
        <div className="space-y-1 text-xs">
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

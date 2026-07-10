import React from "react";

export interface FeatureGridProps {
  title?: string;
  items?: string;
}

export function FeatureGrid({ title, items }: FeatureGridProps) {
  const itemList = items ? items.split(",") : [];
  return (
    <section className="px-8 py-16 bg-neutral-50">
      {title && (
        <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "Outfit, sans-serif" }}>
          {title}
        </h2>
      )}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {itemList.map((it, i) => (
          <div
            key={i}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex flex-col justify-between h-40"
          >
            <div className="text-2xl font-bold text-neutral-300">0{i + 1}</div>
            <div className="font-bold text-sm text-[#0F1020]">{it.trim()}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default FeatureGrid;

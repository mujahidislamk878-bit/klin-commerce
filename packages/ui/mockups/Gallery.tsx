import React from "react";

export interface GalleryProps {
  items?: string;
}

export function Gallery({ items }: GalleryProps) {
  const itemList = items ? items.split(",") : [];
  return (
    <section className="px-8 py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {itemList.map((it, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-[24px] bg-neutral-100 p-6 flex flex-col justify-end text-xs font-bold text-neutral-800 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="relative z-10 text-white font-mono text-[10px] tracking-wider uppercase">
              {it.trim()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Gallery;

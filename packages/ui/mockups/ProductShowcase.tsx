import React from "react";

export interface ProductShowcaseProps {
  productId?: string;
  titleOverride?: string;
  showPrice?: boolean;
  accentColor?: string;
}

export function ProductShowcase({
  titleOverride,
  showPrice = true,
  accentColor = "#6366F1",
}: ProductShowcaseProps) {
  return (
    <div className="max-w-4xl mx-auto my-12 p-8 rounded-3xl border border-black/5 bg-white shadow-sm flex flex-col md:flex-row gap-8 items-center text-left">
      <div className="w-full md:w-1/2 aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center text-xs font-semibold text-neutral-400">
        [Product Image Container]
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <span className="px-2.5 py-0.5 rounded-full font-bold text-[9px] bg-indigo-500/10 text-indigo-600 font-mono tracking-wider uppercase">
          Hot Seller
        </span>
        <h3 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
          {titleOverride}
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          High-performance canvas threads designed for active daily routines.
        </p>
        {showPrice && <div className="text-lg font-bold font-mono">$89.00</div>}
        <button
          className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
export default ProductShowcase;

"use client";

import { forwardRef, useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../buttons/Button";
import { Rating } from "../marketing/Rating";
import type { EditableProps } from "../../types";

export interface ProductSingleProps extends EditableProps {
  productName?: string;
  price?: number;
  sku?: string;
  stock?: number;
  description?: string;
  images?: string[];
  variants?: { name: string; options: string[] }[];
}

const ProductGallery = forwardRef<HTMLDivElement, { images?: string[]; className?: string }>(
  ({ images = ["https://placehold.co/600x600"], className, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FAFBFC] border border-[#0F1020]/5">
          <img src={images[activeIndex]} alt="Product" className="w-full h-full object-cover" />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden border bg-white shrink-0",
                  activeIndex === idx ? "border-[#0F1020] border-2" : "border-[#0F1020]/5"
                )}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
ProductGallery.displayName = "ProductGallery";

const ProductRating = forwardRef<HTMLDivElement, { value: number; count?: number; className?: string }>(
  ({ value, count = 24, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        <Rating value={value} size="sm" />
        <span className="text-xs text-[#0F1020]/55 font-semibold">({count} reviews)</span>
      </div>
    );
  }
);
ProductRating.displayName = "ProductRating";

const SkuDisplay = ({ sku }: { sku?: string }) => {
  if (!sku) return null;
  return (
    <div className="text-xs text-[#0F1020]/40 font-mono font-semibold uppercase">
      SKU: {sku}
    </div>
  );
};

const StockIndicator = ({ stock = 10 }: { stock?: number }) => {
  const inStock = stock > 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", inStock ? "bg-emerald-500" : "bg-red-500")} />
      <span className="text-xs font-semibold text-[#0F1020]/60">
        {inStock ? `${stock} in stock` : "Out of stock"}
      </span>
    </div>
  );
};

const VariantSelector = forwardRef<HTMLDivElement, { variants?: { name: string; options: string[] }[]; className?: string }>(
  ({ variants = [{ name: "Size", options: ["S", "M", "L"] }], className, ...props }, ref) => {
    const [selected, setSelected] = useState<Record<string, string>>({});
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {variants.map((v) => (
          <div key={v.name} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1020]/40">{v.name}</h4>
            <div className="flex flex-wrap gap-2">
              {v.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelected((prev) => ({ ...prev, [v.name]: opt }))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300",
                    selected[v.name] === opt
                      ? "bg-[#0F1020] text-white border-[#0F1020]"
                      : "border-[#0F1020]/10 hover:border-[#0F1020]/25 text-[#0F1020]/70"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
VariantSelector.displayName = "VariantSelector";

const QuantitySelector = forwardRef<HTMLDivElement, { quantity: number; onChange: (q: number) => void; className?: string }>(
  ({ quantity, onChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center border border-[#0F1020]/10 rounded-xl overflow-hidden w-fit h-10 bg-white", className)}
        {...props}
      >
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          className="px-3 h-full hover:bg-[#0F1020]/5 text-[#0F1020]/60 transition"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="px-4 text-sm font-semibold select-none min-w-[40px] text-center">{quantity}</span>
        <button
          onClick={() => onChange(quantity + 1)}
          className="px-3 h-full hover:bg-[#0F1020]/5 text-[#0F1020]/60 transition"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
);
QuantitySelector.displayName = "QuantitySelector";

const ProductDetails = forwardRef<HTMLDivElement, ProductSingleProps>(
  (
    {
      productName = "Product Name",
      price = 129.99,
      sku = "KLIN-PROD-01",
      stock = 15,
      description = "High quality design system component built for the Klin commerce platform.",
      variants,
      className,
      ...props
    },
    ref
  ) => {
    const [quantity, setQuantity] = useState(1);
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <div className="space-y-2">
          <SkuDisplay sku={sku} />
          <h2 className="text-3xl font-bold text-[#0F1020]">{productName}</h2>
          <ProductRating value={4} />
        </div>

        <div className="text-2xl font-bold text-[#0F1020]">${price.toFixed(2)}</div>

        <p className="text-sm text-[#0F1020]/65 leading-relaxed">{description}</p>

        <StockIndicator stock={stock} />

        <VariantSelector variants={variants} />

        <div className="flex flex-wrap items-center gap-4 border-t border-[#0F1020]/5 pt-6">
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <Button variant="primary" className="flex-1 min-w-[150px]">
            Add to Cart
          </Button>
        </div>
      </div>
    );
  }
);
ProductDetails.displayName = "ProductDetails";

const ProductTabs = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState("desc");
    return (
      <div ref={ref} className={cn("space-y-6 w-full border-t border-[#0F1020]/5 pt-8", className)} {...props}>
        <div className="flex border-b border-[#0F1020]/5 gap-6">
          {[
            { id: "desc", label: "Description" },
            { id: "specs", label: "Specifications" },
            { id: "shipping", label: "Shipping & Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-semibold border-b-2 transition-all duration-300 relative -mb-[2px]",
                activeTab === tab.id
                  ? "border-[#0F1020] text-[#0F1020]"
                  : "border-transparent text-[#0F1020]/50 hover:text-[#0F1020]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-[#0F1020]/65 leading-relaxed min-h-[100px]">
          {activeTab === "desc" && (
            <p>This premium design component is built for ultimate reusability. Extends the core styling elements of the landing and dashboard layers.</p>
          )}
          {activeTab === "specs" && (
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Framework: React 19 / TypeScript</li>
              <li>Style: Tailwind v4 / HSL custom values</li>
              <li>Animations: Framer Motion</li>
            </ul>
          )}
          {activeTab === "shipping" && (
            <p>Free standard shipping on all design console assets. Digital items delivered instantly in-browser.</p>
          )}
        </div>
      </div>
    );
  }
);
ProductTabs.displayName = "ProductTabs";

const ProductReviews = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const reviews = [
      { author: "Aka Yamanao", rating: 5, date: "July 9, 2026", text: "Incredibly fast builder components. Redesigned my dashboard in minutes." },
      { author: "Nupur Sonowal", rating: 4, date: "June 25, 2026", text: "Clean codebase and very robust styling system." },
    ];
    return (
      <div ref={ref} className={cn("space-y-6 w-full border-t border-[#0F1020]/5 pt-8", className)} {...props}>
        <h3 className="text-xl font-bold text-[#0F1020]">Customer Reviews</h3>
        <div className="space-y-4">
          {reviews.map((r, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#FAFBFC] border border-[#0F1020]/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#0F1020]">{r.author}</span>
                <span className="text-xs text-[#0F1020]/40">{r.date}</span>
              </div>
              <Rating value={r.rating} size="sm" />
              <p className="text-xs md:text-sm text-[#0F1020]/75">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ProductReviews.displayName = "ProductReviews";

export { ProductGallery, ProductRating, SkuDisplay, StockIndicator, VariantSelector, QuantitySelector, ProductDetails, ProductTabs, ProductReviews };

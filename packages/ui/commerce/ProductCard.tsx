"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Eye,
  Star,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Types ──

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  badge?: string;
  rating?: number;
}

interface ProductCardProps extends EditableProps {
  product: Product;
  layout?: "default" | "horizontal" | "minimal" | "compact";
  aspectRatio?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  currency?: string;
  showRating?: boolean;
  showDescription?: boolean;
}

export type { Product, ProductCardProps };

// ── Helpers ──

function formatPrice(price: number, currency = "$"): string {
  return `${currency}${price.toFixed(2)}`;
}

// ── Component ──

/**
 * ProductCard renders a product with image, name, price, badge,
 * rating, and action buttons. Supports multiple layouts.
 *
 * @example
 * <ProductCard
 *   product={{ id: 1, name: "Running Shoes", price: 129.99, image: "/shoe.jpg", badge: "Sale" }}
 *   onAddToCart={(p) => console.log("add", p)}
 * />
 */
const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      product,
      layout = "default",
      aspectRatio = "4/3",
      onAddToCart,
      onQuickView,
      currency = "$",
      showRating = true,
      showDescription = true,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const {
      name,
      description,
      price,
      compareAtPrice,
      image,
      badge,
      rating,
    } = product;

    const discount = compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

    // ── Layout variants ──
    const isHorizontal = layout === "horizontal";
    const isMinimal = layout === "minimal";
    const isCompact = layout === "compact";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative rounded-xl bg-card text-card-foreground border border-border overflow-hidden",
          "transition-all duration-200",
          !isMinimal && "shadow-sm",
          isHorizontal ? "flex" : "flex flex-col",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        {...props}
      >
        {/* ── Image ── */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            isHorizontal && "w-2/5 flex-shrink-0",
            !isHorizontal && "w-full",
          )}
          style={{ aspectRatio: isMinimal ? "1" : aspectRatio }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              isHovered && "scale-105",
            )}
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}

          {/* Badge */}
          {badge && !isMinimal && (
            <span
              className={cn(
                "absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full",
                badge.toLowerCase() === "sale"
                  ? "bg-red-500 text-white"
                  : badge.toLowerCase() === "new"
                    ? "bg-green-500 text-white"
                    : "bg-primary text-primary-foreground",
              )}
            >
              {badge}
            </span>
          )}

          {/* Discount badge */}
          {discount > 0 && !isMinimal && !badge && (
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-red-500 text-white">
              -{discount}%
            </div>
          )}

          {/* Quick view overlay */}
          {onQuickView && isHovered && !isMinimal && (
            <motion.div
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center bg-black/20",
                "backdrop-blur-[1px]",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                  "bg-background/90 text-foreground hover:bg-background",
                  "transition-colors duration-150 shadow-sm backdrop-blur-sm",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Content ── */}
        <div
          className={cn(
            "flex flex-col flex-1",
            isHorizontal ? "p-4 justify-center" : "p-4",
            isMinimal && "p-2",
            isCompact && "p-3",
          )}
        >
          {/* Name */}
          <h3
            className={cn(
              "font-semibold text-foreground leading-snug",
              isMinimal ? "text-xs text-center mt-1" : "text-sm",
              isCompact && "text-xs",
            )}
          >
            {name}
          </h3>

          {/* Description */}
          {showDescription && description && !isMinimal && !isCompact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          {showRating && rating !== undefined && !isMinimal && (
            <div className="flex items-center gap-1 mt-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-0.5">
                ({rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price row */}
          <div
            className={cn(
              "flex items-center gap-2 mt-auto",
              isMinimal && "justify-center",
            )}
          >
            <span
              className={cn(
                "font-bold text-foreground",
                isMinimal ? "text-xs" : "text-sm",
                isCompact && "text-xs",
              )}
            >
              {formatPrice(price, currency)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(compareAtPrice, currency)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          {onAddToCart && !isMinimal && (
            <button
              type="button"
              className={cn(
                "mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "transition-colors duration-150",
                "py-2",
                isCompact && "py-1.5 text-[10px]",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className={cn("h-3.5 w-3.5", isCompact && "h-3 w-3")} />
              Add to Cart
            </button>
          )}
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
export default ProductCard;
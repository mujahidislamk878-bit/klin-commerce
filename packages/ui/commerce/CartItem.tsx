"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Types ──

interface CartItemData {
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface CartItemProps extends EditableProps {
  item: CartItemData;
  onQuantityChange?: (productId: string | number, quantity: number) => void;
  onRemove?: (productId: string | number) => void;
  maxQuantity?: number;
  showImage?: boolean;
  editable?: boolean;
}

export type { CartItemData, CartItemProps };

// ── Helpers ──

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// ── Component ──

/**
 * CartItem renders a single row in a shopping cart with product
 * image, name, price, quantity controls, subtotal, and remove button.
 *
 * @example
 * <CartItem
 *   item={{ productId: 1, name: "Running Shoes", price: 129.99, quantity: 2, image: "/shoe.jpg" }}
 *   onQuantityChange={(id, qty) => console.log(id, qty)}
 *   onRemove={(id) => console.log("remove", id)}
 * />
 */
const CartItem = forwardRef<HTMLDivElement, CartItemProps>(
  (
    {
      className,
      item,
      onQuantityChange,
      onRemove,
      maxQuantity = 99,
      showImage = true,
      editable = true,
      ...props
    },
    ref,
  ) => {
    const { productId, name, price, quantity, image, variant } = item;
    const subtotal = price * quantity;
    const isMin = quantity <= 1;
    const isMax = quantity >= maxQuantity;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex items-center gap-4 py-4 border-b border-border last:border-b-0",
          className,
        )}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.2 }}
        layout
        {...props}
      >
        {/* Image */}
        {showImage && (
          <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-muted">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-[10px]">
                No Image
              </div>
            )}
          </div>
        )}

        {/* Name + variant */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          {variant && (
            <p className="text-xs text-muted-foreground mt-0.5">{variant}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1 md:hidden">
            {formatPrice(price)} each
          </p>
        </div>

        {/* Unit price (desktop) */}
        <div className="hidden md:block text-sm text-muted-foreground min-w-[60px] text-right">
          {formatPrice(price)}
        </div>

        {/* Quantity controls */}
        <div className="flex-shrink-0">
          {editable ? (
            <div className="flex items-center gap-1 border border-border rounded-lg">
              <button
                type="button"
                disabled={isMin}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "disabled:pointer-events-none disabled:opacity-30",
                )}
                onClick={() => onQuantityChange?.(productId, quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="w-8 text-center text-sm font-medium tabular-nums select-none">
                {quantity}
              </span>

              <button
                type="button"
                disabled={isMax}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "disabled:pointer-events-none disabled:opacity-30",
                )}
                onClick={() => onQuantityChange?.(productId, quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-sm font-medium tabular-nums">x{quantity}</span>
          )}
        </div>

        {/* Subtotal */}
        <div className="min-w-[80px] text-right">
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {formatPrice(subtotal)}
          </p>
        </div>

        {/* Remove */}
        {editable && onRemove && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 flex-shrink-0 rounded-lg transition-colors",
              "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
            )}
            onClick={() => onRemove(productId)}
            aria-label={`Remove ${name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    );
  },
);

CartItem.displayName = "CartItem";

export { CartItem };
export default CartItem;
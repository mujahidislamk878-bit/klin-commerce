"use client";

import { forwardRef, useState } from "react";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../buttons/Button";
import type { EditableProps } from "../../types";

export interface CartProps extends EditableProps {
  items?: { id: string | number; name: string; price: number; quantity: number; image?: string }[];
  subtotal?: number;
  onCheckout?: () => void;
}

const AddToCartButton = forwardRef<HTMLButtonElement, { onClick?: () => void; className?: string }>(
  ({ onClick, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        variant="primary"
        className={cn("w-full gap-2", className)}
        {...props}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to Cart
      </Button>
    );
  }
);
AddToCartButton.displayName = "AddToCartButton";

const BuyNowButton = forwardRef<HTMLButtonElement, { onClick?: () => void; className?: string }>(
  ({ onClick, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        variant="gradient"
        gradientFrom="#0F1020"
        gradientTo="#2E2E3A"
        className={cn("w-full font-bold", className)}
        {...props}
      >
        Buy Now
      </Button>
    );
  }
);
BuyNowButton.displayName = "BuyNowButton";

const CartSummary = forwardRef<HTMLDivElement, { subtotal?: number; shipping?: number; tax?: number; className?: string }>(
  ({ subtotal = 129.99, shipping = 0.0, tax = 10.4, className, ...props }, ref) => {
    const total = subtotal + shipping + tax;
    return (
      <div ref={ref} className={cn("p-6 rounded-2xl bg-[#FAFBFC] border border-[#0F1020]/5 space-y-4", className)} {...props}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1020]/45">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#0F1020]/70">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#0F1020]/70">
            <span>Shipping</span>
            <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-[#0F1020]/70">
            <span>Estimated Tax</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-[#0F1020]/5 pt-4 flex justify-between text-base font-bold text-[#0F1020]">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
);
CartSummary.displayName = "CartSummary";

const CartDrawer = forwardRef<HTMLDivElement, CartProps & { open?: boolean; onClose?: () => void }>(
  (
    {
      items = [
        { id: 1, name: "Product Design Template", price: 129.99, quantity: 1, image: "https://placehold.co/100x100" },
      ],
      subtotal = 129.99,
      open = false,
      onClose,
      onCheckout,
      className,
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end", className)}
        onClick={onClose}
        {...props}
      >
        <div
          className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slideLeft"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#0F1020]/5 pb-4">
            <h2 className="text-lg font-bold text-[#0F1020] flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({items.length})
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-[#0F1020]/5 text-[#0F1020]/60">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-[#FAFBFC] border border-[#0F1020]/5 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#0F1020]/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-[#0F1020]">{item.name}</h4>
                    <div className="text-xs text-[#0F1020]/60">
                      Qty {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <button className="p-2 rounded-xl text-red-500 hover:bg-red-500/5">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[#0F1020]/40 font-semibold">
                Your cart is empty
              </div>
            )}
          </div>

          {/* Cart summary & actions */}
          <div className="border-t border-[#0F1020]/5 pt-6 space-y-4 bg-white">
            <div className="flex justify-between font-bold text-base text-[#0F1020]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Button onClick={onCheckout} variant="primary" className="w-full h-11">
                Checkout
              </Button>
              <button
                onClick={onClose}
                className="w-full text-center text-xs font-semibold text-[#0F1020]/50 hover:text-[#0F1020] py-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CartDrawer.displayName = "CartDrawer";

const MiniCart = forwardRef<HTMLDivElement, CartProps>(
  ({ items = [], subtotal = 0, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2.5 rounded-xl border border-[#0F1020]/10 hover:border-[#0F1020]/25 bg-white text-[#0F1020] transition duration-300"
        >
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {items.length}
            </span>
          )}
        </button>
        <CartDrawer items={items} subtotal={subtotal} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  }
);
MiniCart.displayName = "MiniCart";

export { AddToCartButton, BuyNowButton, CartSummary, CartDrawer, MiniCart };

"use client";

import { forwardRef, useState } from "react";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { cn } from "../../utils/cn";
import { Input } from "../forms/Input";
import { Button } from "../buttons/Button";
import { CartSummary } from "./CartBlocks";
import type { EditableProps } from "../../types";

export interface CheckoutProps extends EditableProps {
  onSubmit?: () => void;
}

const ShippingAddress = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1020]/45">Shipping Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" placeholder="First name" required />
          <Input label="Last Name" placeholder="Last name" required />
        </div>
        <Input label="Address" placeholder="123 Design Lane" required />
        <div className="grid grid-cols-3 gap-4">
          <Input label="City" placeholder="City" required />
          <Input label="State" placeholder="State" required />
          <Input label="ZIP Code" placeholder="ZIP" required />
        </div>
      </div>
    );
  }
);
ShippingAddress.displayName = "ShippingAddress";

const BillingAddress = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4 border-t border-[#0F1020]/5 pt-6", className)} {...props}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1020]/45">Billing Address</h3>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#0F1020]/60 select-none">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            Same as shipping
          </label>
        </div>
      </div>
    );
  }
);
BillingAddress.displayName = "BillingAddress";

const ShippingSelector = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const [selected, setSelected] = useState("free");
    return (
      <div ref={ref} className={cn("space-y-4 border-t border-[#0F1020]/5 pt-6", className)} {...props}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1020]/45">Shipping Method</h3>
        <div className="space-y-2">
          {[
            { id: "free", label: "Free Standard Delivery", desc: "Delivery in 3-5 business days", price: "$0.00" },
            { id: "exp", label: "Express Delivery", desc: "Delivery in 1-2 business days", price: "$15.00" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center justify-between border text-left transition-all duration-300 bg-white",
                selected === m.id
                  ? "border-[#0F1020] ring-2 ring-[#0F1020]/5"
                  : "border-[#0F1020]/5 hover:border-[#0F1020]/15"
              )}
            >
              <div className="flex gap-3 items-center">
                <Truck className="h-5 w-5 text-[#0F1020]/40 shrink-0" />
                <div>
                  <span className="block text-sm font-bold text-[#0F1020]">{m.label}</span>
                  <span className="block text-xs text-[#0F1020]/55 mt-0.5">{m.desc}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#0F1020]">{m.price}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);
ShippingSelector.displayName = "ShippingSelector";

const PaymentMethods = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const [selected, setSelected] = useState("card");
    return (
      <div ref={ref} className={cn("space-y-4 border-t border-[#0F1020]/5 pt-6", className)} {...props}>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1020]/45">Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "card", label: "Credit Card", icon: <CreditCard className="h-4 w-4" /> },
            { id: "paypal", label: "PayPal", icon: <ShieldCheck className="h-4 w-4" /> },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={cn(
                "p-3 rounded-xl flex items-center justify-center gap-2 border text-sm font-semibold transition-all duration-300",
                selected === m.id
                  ? "bg-[#0F1020] text-white border-[#0F1020] shadow-lg shadow-[#0F1020]/10"
                  : "border-[#0F1020]/10 hover:border-[#0F1020]/25 text-[#0F1020]/75 bg-white"
              )}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
        {selected === "card" && (
          <div className="space-y-3 bg-[#FAFBFC] p-4 rounded-2xl border border-[#0F1020]/5 mt-3">
            <Input label="Card Number" placeholder="1234 5678 1234 5678" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiration Date" placeholder="MM/YY" required />
              <Input label="CVC" placeholder="123" required />
            </div>
          </div>
        )}
      </div>
    );
  }
);
PaymentMethods.displayName = "PaymentMethods";

const CheckoutForm = forwardRef<HTMLDivElement, CheckoutProps>(
  ({ onSubmit, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto px-4 py-8", className)}
        {...props}
      >
        {/* Billing/Shipping Information Form */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-[28px] border border-[#0F1020]/5 shadow-sm">
          <ShippingAddress />
          <BillingAddress />
          <ShippingSelector />
          <PaymentMethods />
        </div>

        {/* Cart Order Summary Sidebar */}
        <div className="space-y-6">
          <CartSummary />
          <Button onClick={onSubmit} variant="primary" className="w-full h-12 text-base font-bold shadow-xl">
            Place Order
          </Button>
        </div>
      </div>
    );
  }
);
CheckoutForm.displayName = "CheckoutForm";

export { ShippingAddress, BillingAddress, ShippingSelector, PaymentMethods, CheckoutForm };

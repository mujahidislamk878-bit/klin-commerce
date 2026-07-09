"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn";
import { Input } from "./Input";
import type { EditableProps } from "../../types";

export interface CompositeInputProps extends EditableProps {
  label?: string;
  placeholder?: string;
}

const SearchInput = forwardRef<HTMLInputElement, CompositeInputProps & { value?: string; onChange?: (val: string) => void }>(
  ({ placeholder = "Search...", value = "", onChange, className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center gap-3 px-4 rounded-xl border border-[#0F1020]/10 bg-white h-11 focus-within:ring-2 focus-within:ring-[#0F1020]/5 focus-within:border-[#0F1020]/25 transition duration-300 w-full", className)}>
        <Search className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent border-0 p-0 text-sm text-[#0F1020] placeholder:text-[#0F1020]/25 focus:outline-none"
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

const AddressForm = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <Input label="Street Address" placeholder="123 Main St" required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" placeholder="City" required />
          <Input label="State / Province" placeholder="State" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="ZIP / Postal Code" placeholder="ZIP" required />
          <Input label="Country" placeholder="Country" required />
        </div>
      </div>
    );
  }
);
AddressForm.displayName = "AddressForm";

export { SearchInput, AddressForm };

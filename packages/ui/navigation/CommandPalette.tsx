"use client";

import { forwardRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface CommandPaletteProps extends EditableProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: { category: string; label: string; href: string }[];
}

const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open = false,
      onOpenChange,
      items = [
        { category: "Navigation", label: "Go to Dashboard", href: "/dashboard/home" },
        { category: "Navigation", label: "Go to Products", href: "/dashboard/products" },
        { category: "Commerce", label: "View Cart", href: "/cart" },
        { category: "Commerce", label: "Checkout", href: "/checkout" },
        { category: "Account", label: "Edit Settings", href: "/dashboard/settings" },
      ],
      className,
      ...props
    },
    ref
  ) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    const handleClose = () => {
      setIsOpen(false);
      onOpenChange?.(false);
    };

    const filtered = items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/40 backdrop-blur-sm",
          className
        )}
        onClick={handleClose}
        {...props}
      >
        <div
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#0F1020]/10 bg-white shadow-2xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 border-b border-[#0F1020]/5 h-12 bg-white">
            <Search className="h-4 w-4 text-[#0F1020]/40 shrink-0" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-sm placeholder:text-[#0F1020]/30 text-[#0F1020] focus:outline-none"
              autoFocus
            />
            <kbd className="text-[10px] font-mono border border-[#0F1020]/10 px-1.5 py-0.5 rounded bg-[#FAFBFC] text-[#0F1020]/40">
              ESC
            </kbd>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2 space-y-3 bg-[#FAFBFC]">
            {filtered.length > 0 ? (
              <ul className="space-y-1">
                {filtered.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      onClick={handleClose}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-white border border-transparent hover:border-[#0F1020]/5 text-[#0F1020] transition-all"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] uppercase font-bold text-[#0F1020]/30">
                        {item.category}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-[#0F1020]/40 font-semibold">
                No results found
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CommandPalette.displayName = "CommandPalette";
export default CommandPalette;
export { CommandPalette };

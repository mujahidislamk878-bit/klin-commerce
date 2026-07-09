"use client";

import { forwardRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface NavbarProps extends EditableProps {
  brandName?: string;
  sticky?: boolean;
  transparent?: boolean;
  links?: {
    label: string;
    href: string;
    megaMenu?: {
      columns: {
        title: string;
        items: { label: string; href: string; description?: string }[];
      }[];
    };
  }[];
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      brandName = "Klin",
      sticky = true,
      transparent = false,
      links = [
        { label: "Home", href: "/" },
        {
          label: "Solutions",
          href: "#",
          megaMenu: {
            columns: [
              {
                title: "Design",
                items: [
                  { label: "Visual Builder", href: "/builder", description: "Design in real time" },
                  { label: "Design System", href: "/system", description: "Manage components" },
                ],
              },
              {
                title: "Commerce",
                items: [
                  { label: "Shop Storefront", href: "/store", description: "Product grids and cart" },
                  { label: "Customer Profile", href: "/profile", description: "Loyalty points & history" },
                ],
              },
            ],
          },
        },
        { label: "Pricing", href: "/pricing" },
      ],
      className,
      ...props
    },
    ref
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMega, setActiveMega] = useState<number | null>(null);

    return (
      <header
        ref={ref}
        className={cn(
          "w-full z-50 transition-all duration-300 border-b border-[#0F1020]/5",
          sticky && "sticky top-0",
          transparent
            ? "bg-transparent backdrop-blur-none"
            : "bg-white/90 backdrop-blur-md",
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#0F1020] rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">K</span>
            </div>
            <span className="font-bold text-[#0F1020] text-lg tracking-wide">{brandName}</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 h-full">
            {links.map((link, idx) => {
              const isMega = !!link.megaMenu;
              return (
                <div
                  key={idx}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => isMega && setActiveMega(idx)}
                  onMouseLeave={() => isMega && setActiveMega(null)}
                >
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-[#0F1020]/70 hover:text-[#0F1020] transition-colors flex items-center gap-1 py-4"
                  >
                    {link.label}
                    {isMega && <ChevronDown className="h-4 w-4 opacity-50" />}
                  </a>

                  {/* Mega Menu Dropdown */}
                  {isMega && activeMega === idx && link.megaMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white border border-[#0F1020]/5 shadow-xl rounded-2xl p-6 grid grid-cols-2 gap-6 z-50 animate-fadeInUp">
                      {link.megaMenu.columns.map((col, colIdx) => (
                        <div key={colIdx} className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1020]/40">
                            {col.title}
                          </h4>
                          <ul className="space-y-2">
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <a
                                  href={item.href}
                                  className="block p-2 rounded-lg hover:bg-[#FAFBFC] transition-colors"
                                >
                                  <span className="block text-sm font-bold text-[#0F1020]">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="block text-xs text-[#0F1020]/55 mt-0.5">
                                      {item.description}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[#0F1020]/5 text-[#0F1020] md:hidden transition"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#0F1020]/5 bg-white px-4 py-4 space-y-3 shadow-inner">
            {links.map((link, idx) => (
              <div key={idx} className="space-y-1">
                <a
                  href={link.href}
                  className="block py-2 text-base font-semibold text-[#0F1020]/70 hover:text-[#0F1020]"
                >
                  {link.label}
                </a>
                {link.megaMenu?.columns.map((col, colIdx) => (
                  <div key={colIdx} className="pl-4 space-y-1">
                    <div className="text-xs font-bold text-[#0F1020]/40 uppercase py-1">
                      {col.title}
                    </div>
                    {col.items.map((item, itemIdx) => (
                      <a
                        key={itemIdx}
                        href={item.href}
                        className="block py-1 text-sm text-[#0F1020]/60 hover:text-[#0F1020]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </header>
    );
  }
);

Navbar.displayName = "Navbar";
export default Navbar;
export { Navbar };

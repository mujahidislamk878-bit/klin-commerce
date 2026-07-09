"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface FooterNavProps extends EditableProps {
  columns?: {
    title: string;
    items: { label: string; href: string }[];
  }[];
}

const FooterNav = forwardRef<HTMLDivElement, FooterNavProps>(
  (
    {
      columns = [
        {
          title: "Product",
          items: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ],
        },
        {
          title: "Company",
          items: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
          ],
        },
        {
          title: "Legal",
          items: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
          ],
        },
      ],
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-t border-[#0F1020]/5 w-full", className)}
        {...props}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1020]/40">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-[#0F1020]/65 hover:text-[#0F1020] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
);

FooterNav.displayName = "FooterNav";
export default FooterNav;
export { FooterNav };

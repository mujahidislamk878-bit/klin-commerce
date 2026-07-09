"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface SidebarNavProps extends EditableProps {
  groups?: {
    title?: string;
    items: { label: string; href: string; icon?: React.ReactNode; active?: boolean }[];
  }[];
}

const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  (
    {
      groups = [
        {
          title: "Dashboard",
          items: [
            { label: "Overview", href: "/dashboard/home", active: true },
            { label: "Orders", href: "/dashboard/orders" },
          ],
        },
        {
          title: "Settings",
          items: [
            { label: "Profile", href: "/dashboard/settings" },
          ],
        },
      ],
      className,
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn("w-64 border-r border-[#0F1020]/5 bg-[#FAFBFC] p-6 flex flex-col gap-6", className)}
        {...props}
      >
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            {group.title && (
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1020]/40 px-3">
                {group.title}
              </h4>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                      item.active
                        ? "bg-[#0F1020] text-white shadow-lg shadow-[#0F1020]/10"
                        : "text-[#0F1020]/60 hover:bg-[#0F1020]/5 hover:text-[#0F1020]"
                    )}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    );
  }
);

SidebarNav.displayName = "SidebarNav";
export default SidebarNav;
export { SidebarNav };

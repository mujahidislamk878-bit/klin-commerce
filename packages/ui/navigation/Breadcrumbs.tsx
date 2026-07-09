"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { cn } from "../../utils/cn";
import type { BreadcrumbsProps } from "../../types";

const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      items,
      separator = "/",
      homeHref,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("mb-4", className)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {homeHref && (
            <li>
              <a
                href={homeHref}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </li>
          )}

          {homeHref && items.length > 0 && (
            <li aria-hidden="true" className="text-muted-foreground/40 select-none">
              {separator}
            </li>
          )}

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-1.5"
              >
                {!isLast && item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      isLast && "text-foreground font-medium cursor-default",
                    )}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground/40 select-none"
                  >
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </motion.nav>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
export default Breadcrumbs;

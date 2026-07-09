"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import type { NotificationBarProps } from "../../types";

// ── Maps ──

const variantClasses: Record<string, string> = {
  info: cn(
    "bg-blue-50 text-blue-700 border-blue-200",
    "dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  ),
  success: cn(
    "bg-green-50 text-green-700 border-green-200",
    "dark:bg-green-950 dark:text-green-200 dark:border-green-800",
  ),
  warning: cn(
    "bg-amber-50 text-amber-700 border-amber-200",
    "dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
  ),
  error: cn(
    "bg-red-50 text-red-700 border-red-200",
    "dark:bg-red-950 dark:text-red-200 dark:border-red-800",
  ),
};

// ── Component ──

const NotificationBar = forwardRef<HTMLDivElement, NotificationBarProps>(
  (
    {
      className,
      message,
      variant = "info",
      dismissible = false,
      link,
      ...props
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);

    return (
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            ref={ref}
            className={cn(
              "sticky top-0 z-50 w-full border-b px-4 py-3 text-sm",
              "flex items-center justify-between gap-4",
              variantClasses[variant],
              className,
            )}
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            {...props}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="truncate">{message}</span>
              {link && (
                <a
                  href={link.href}
                  className="underline font-medium whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </a>
              )}
            </div>

            {dismissible && (
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className={cn(
                  "shrink-0 p-1 rounded-md transition-colors",
                  "hover:bg-black/10 dark:hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

NotificationBar.displayName = "NotificationBar";

export { NotificationBar };
export default NotificationBar;

"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { StatsProps } from "../../types";

// ── Component ──

const defaultColumns = "grid-cols-2 md:grid-cols-4";

const Stats = forwardRef<HTMLDivElement, StatsProps>(
  (
    {
      className,
      stats,
      columns,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const gridStyle: React.CSSProperties = {};
    if (typeof columns === "number") {
      gridStyle.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "grid gap-4",
          typeof columns !== "number" && defaultColumns,
          className,
        )}
        style={gridStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        {...props}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={cn(
              "text-center",
              variant === "card" &&
                "bg-card border rounded-xl p-6 shadow-sm",
              variant === "bordered" &&
                "border border-border rounded-lg p-4",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="text-3xl md:text-4xl font-bold tracking-tight">
              {stat.prefix && (
                <span className="text-muted-foreground mr-0.5">
                  {stat.prefix}
                </span>
              )}
              {stat.value}
              {stat.suffix && (
                <span className="text-muted-foreground ml-0.5">
                  {stat.suffix}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  },
);

Stats.displayName = "Stats";

export { Stats };
export default Stats;

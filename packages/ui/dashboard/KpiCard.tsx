"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Local props (matched to spec; extends EditableProps for consistency) ──

interface KpiCardProps extends EditableProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  icon?: ReactNode;
  variant?: "default" | "compact" | "detailed" | "border";
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

export type { KpiCardProps };

// ── Component ──

/**
 * KpiCard displays a key performance indicator with title, value,
 * optional trend indicator, and an icon. Supports multiple variants.
 *
 * @example
 * <KpiCard
 *   title="Revenue"
 *   value="$48,290"
 *   trend={{ direction: "up", value: "12.5%" }}
 *   icon={<TrendingUp />}
 * />
 */
const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      className,
      title,
      value,
      prefix,
      suffix,
      trend,
      icon,
      variant = "default",
      bgColor,
      textColor,
      onClick,
      ...props
    },
    ref,
  ) => {
    // ── Trend helpers ──
    const trendColor =
      trend?.direction === "up"
        ? "text-green-500"
        : trend?.direction === "down"
          ? "text-red-500"
          : "text-muted-foreground";

    const trendArrow =
      trend?.direction === "up" ? "↑" : trend?.direction === "down" ? "↓" : "→";

    // ── Variant styles ──
    const variantCard: Record<string, string> = {
      default: "p-6",
      compact: "p-4",
      detailed: "p-6",
      border: "p-6 border-l-4",
    };

    const borderColorClass =
      variant === "border"
        ? trend?.direction === "up"
          ? "border-l-green-500"
          : trend?.direction === "down"
            ? "border-l-red-500"
            : "border-l-muted"
        : "";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-xl bg-card text-card-foreground shadow-sm border border-border overflow-hidden",
          "transition-all duration-200",
          variantCard[variant] || variantCard.default,
          borderColorClass,
          onClick && "cursor-pointer",
          className,
        )}
        style={{
          ...(bgColor ? { backgroundColor: bgColor } : {}),
          ...(textColor ? { color: textColor } : {}),
        }}
        whileTap={onClick ? { scale: 0.97 } : undefined}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: title + value + trend */}
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>

            <div className="flex items-baseline gap-1.5">
              {prefix && (
                <span className="text-sm text-muted-foreground">{prefix}</span>
              )}
              <span className="text-2xl font-bold tracking-tight">{value}</span>
              {suffix && (
                <span className="text-sm text-muted-foreground">{suffix}</span>
              )}
            </div>

            {/* Trend (hidden in compact) */}
            {variant !== "compact" && trend && (
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-sm font-semibold",
                    trendColor,
                  )}
                >
                  <span className="text-xs">{trendArrow}</span>
                  {trend.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>

        {/* Detailed variant: extra metadata row */}
        {variant === "detailed" && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Target</p>
              <p className="font-semibold">--</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="font-semibold">--</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  },
);

KpiCard.displayName = "KpiCard";

export { KpiCard };
export default KpiCard;
"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

// ── Local props ──

interface MetricProps extends EditableProps {
  label: string;
  value: number;
  previousValue?: number;
  format?: "number" | "currency" | "percent" | "duration";
  changeType?: "increase" | "decrease" | "neutral";
  changeValue?: string;
  icon?: ReactNode;
  description?: string;
  chartData?: number[];
  chartColor?: string;
  size?: "sm" | "md" | "lg";
  showSparkline?: boolean;
}

export type { MetricProps };

// ── Helpers ──

function formatValue(value: number, format?: MetricProps["format"]): string {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percent":
      return `${value}%`;
    case "duration": {
      const h = Math.floor(value / 3600);
      const m = Math.floor((value % 3600) / 60);
      const s = value % 60;
      return h > 0
        ? `${h}h ${m}m ${s}s`
        : m > 0
          ? `${m}m ${s}s`
          : `${s}s`;
    }
    case "number":
    default:
      return value.toLocaleString("en-US");
  }
}

const sizeMap: Record<string, string> = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
};

const changeColorMap: Record<string, string> = {
  increase: "text-green-500",
  decrease: "text-red-500",
  neutral: "text-muted-foreground",
};

const changeArrowMap: Record<string, string> = {
  increase: "↑",
  decrease: "↓",
  neutral: "→",
};

// ── Sparkline ──

function Sparkline({
  data,
  color,
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-[2px] h-10">
      {data.map((val, i) => {
        const height = ((val - min) / range) * 100;
        return (
          <div
            key={i}
            className="w-2 rounded-sm transition-all duration-300"
            style={{
              height: `${Math.max(height, 5)}%`,
              backgroundColor: color || "var(--color-primary, #6366f1)",
              opacity: 0.6 + (i / data.length) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Component ──

/**
 * Metric displays a labeled value with optional formatting, change
 * indicators, and an inline sparkline chart.
 *
 * @example
 * <Metric
 *   label="Conversion Rate"
 *   value={5.2}
 *   format="percent"
 *   changeType="increase"
 *   changeValue="+0.8%"
 *   showSparkline
 *   chartData={[2, 3, 4, 3.5, 5, 5.2]}
 * />
 */
const Metric = forwardRef<HTMLDivElement, MetricProps>(
  (
    {
      className,
      label,
      value,
      previousValue,
      format,
      changeType,
      changeValue,
      icon,
      description,
      chartData,
      chartColor,
      size = "md",
      showSparkline = false,
      ...props
    },
    ref,
  ) => {
    const formatted = useMemo(() => formatValue(value, format), [value, format]);

    const changeClass = changeType ? changeColorMap[changeType] : "";
    const changeArrow = changeType ? changeArrowMap[changeType] : "";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl bg-card text-card-foreground p-5 border border-border",
          className,
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        {...props}
      >
        {/* Label row */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {label}
          </p>
          {icon && (
            <span className="flex-shrink-0 text-muted-foreground">{icon}</span>
          )}
        </div>

        {/* Value row */}
        <div className={cn("font-bold tracking-tight", sizeMap[size])}>
          {formatted}
        </div>

        {/* Change indicator */}
        {changeType && changeValue && (
          <div className={cn("flex items-center gap-1 mt-1 text-sm", changeClass)}>
            <span className="text-xs">{changeArrow}</span>
            <span className="font-semibold">{changeValue}</span>
            {previousValue !== undefined && (
              <span className="text-muted-foreground ml-1">
                from {formatValue(previousValue, format)}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}

        {/* Sparkline */}
        {showSparkline && chartData && chartData.length > 1 && (
          <div className="mt-3">
            <Sparkline data={chartData} color={chartColor} />
          </div>
        )}
      </motion.div>
    );
  },
);

Metric.displayName = "Metric";

export { Metric };
export default Metric;
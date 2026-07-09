"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import type { GapSize, Align } from "../../types";

// ── Helpers ──

const gapMap: Record<GapSize, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
  "3xl": "gap-16",
};

const alignMap: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child via Radix Slot */
  asChild?: boolean;
  /** Column ratio expressed as a string, e.g. "1/1", "2/1", "3/1", "3/2" */
  ratio?: string;
  /** Gap between columns */
  gap?: GapSize;
  /** Vertical alignment of columns (align-items) */
  align?: Align;
  /** Minimum column width when stacking is inactive (applied via min-w-0 on each column) */
  columnMinWidth?: string;
  /** Breakpoint at which columns stack vertically */
  stackedOn?: "mobile" | "tablet" | "never";
}

/**
 * Parse a ratio string like "2/1" into [first, second] fraction numbers.
 * Falls back to [1, 1] on invalid input.
 */
function parseRatio(ratio: string | undefined): [number, number] {
  if (!ratio) return [1, 1];
  const parts = ratio.split("/").map(Number);
  if (parts.length !== 2 || parts.some(isNaN) || parts.some((n) => n <= 0)) {
    return [1, 1];
  }
  return parts as [number, number];
}

const Columns = React.forwardRef<HTMLDivElement, ColumnsProps>(
  (
    {
      className,
      asChild = false,
      children,
      ratio = "1/1",
      gap = "md",
      align,
      columnMinWidth,
      stackedOn = "mobile",
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.div;
    const [first, second] = parseRatio(ratio);

    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0] ?? null;
    const secondChild = childrenArray.length >= 2 ? childrenArray[1] : null;
    const extraChildren = childrenArray.slice(2);

    // Responsive direction: stacked (col) at small screens, row at large
    const directionClass =
      stackedOn === "never"
        ? "flex-row"
        : stackedOn === "mobile"
          ? "flex-col md:flex-row"
          : "flex-col lg:flex-row";

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full",
          directionClass,
          gap && gapMap[gap],
          align && alignMap[align],
          className,
        )}
        style={style}
        {...(props as any)}
      >
        <div
          className="min-w-0"
          style={{
            flex: `${first} 1 0%`,
            ...(columnMinWidth ? { minWidth: columnMinWidth } : {}),
          }}
        >
          {firstChild}
        </div>
        {secondChild && (
          <div
            className="min-w-0"
            style={{
              flex: `${second} 1 0%`,
              ...(columnMinWidth ? { minWidth: columnMinWidth } : {}),
            }}
          >
            {secondChild}
          </div>
        )}
        {extraChildren.map((child, i) => (
          <div key={i} className="min-w-0 flex-1">
            {child}
          </div>
        ))}
      </Comp>
    );
  },
);
Columns.displayName = "Columns";

export { Columns };
export default Columns;

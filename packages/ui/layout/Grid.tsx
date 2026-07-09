"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import type { GapSize, Align, Justify } from "../../types";

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

const justifyMap: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const columnCountMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  8: "grid-cols-8",
  12: "grid-cols-12",
};

export interface ResponsiveColumns {
  /** Column count on mobile (applied as grid-cols-N) */
  mobile?: number;
  /** Column count on tablet (applied as sm:grid-cols-N) */
  tablet?: number;
  /** Column count on desktop (applied as md:grid-cols-N) */
  desktop?: number;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child via Radix Slot */
  asChild?: boolean;
  /** Responsive column configuration */
  columns?: number | ResponsiveColumns;
  /** Gap between grid items */
  gap?: GapSize;
  /** Row-specific gap (overrides gap for rows) */
  rowGap?: GapSize;
  /** Vertical alignment of grid items */
  align?: Align;
  /** Horizontal alignment of grid items */
  justify?: Justify;
  /** Minimum child width – applies auto-fill grid when set (overrides columns) */
  minChildWidth?: string;
}

function resolveColumns(columns: number | ResponsiveColumns | undefined): string[] {
  if (!columns) return [];

  if (typeof columns === "number") {
    const cls = columnCountMap[columns];
    return cls ? [cls] : [];
  }

  const classes: string[] = [];
  if (columns.mobile !== undefined) {
    const cls = columnCountMap[columns.mobile];
    if (cls) classes.push(cls);
  }
  if (columns.tablet !== undefined) {
    const cls = columnCountMap[columns.tablet];
    if (cls) classes.push(`sm:${cls}`);
  }
  if (columns.desktop !== undefined) {
    const cls = columnCountMap[columns.desktop];
    if (cls) classes.push(`md:${cls}`);
  }
  return classes;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      asChild = false,
      children,
      columns,
      gap = "md",
      rowGap,
      align,
      justify,
      minChildWidth,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.div;

    const columnClasses = resolveColumns(columns);

    const gridStyle: React.CSSProperties = {
      ...(minChildWidth
        ? {
            gridTemplateColumns: `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`,
          }
        : {}),
      ...(rowGap && rowGap !== gap ? { rowGap: undefined } : {}),
      ...style,
    };

    // If rowGap is specified and different from gap, use CSS row-gap inline
    if (rowGap && rowGap !== gap) {
      const rowGapClass = gapMap[rowGap];
      // Extract the numeric value from the tailwind class to use as inline style
      const rowGapPx: Record<string, string> = {
        "gap-0": "0px",
        "gap-1": "0.25rem",
        "gap-2": "0.5rem",
        "gap-4": "1rem",
        "gap-6": "1.5rem",
        "gap-8": "2rem",
        "gap-12": "3rem",
        "gap-16": "4rem",
      };
      gridStyle.rowGap = rowGapPx[rowGapClass] ?? "1rem";
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "grid",
          gap && gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          columnClasses,
          className,
        )}
        style={gridStyle}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  },
);
Grid.displayName = "Grid";

export { Grid };
export default Grid;

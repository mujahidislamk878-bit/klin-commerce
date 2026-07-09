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

/** Responsive direction config – keys are optional and cascade down */
export interface ResponsiveDirection {
  /** Direction on mobile (applied as flex-N) */
  mobile?: "row" | "col" | "row-reverse" | "col-reverse";
  /** Direction on tablet (applied as sm:flex-N) */
  tablet?: "row" | "col" | "row-reverse" | "col-reverse";
  /** Direction on desktop (applied as md:flex-N) */
  desktop?: "row" | "col" | "row-reverse" | "col-reverse";
}

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child via Radix Slot */
  asChild?: boolean;
  /** Responsive flex-direction */
  direction?: "row" | "col" | "row-reverse" | "col-reverse" | ResponsiveDirection;
  /** Allow items to wrap */
  wrap?: boolean;
  /** Gap between flex items */
  gap?: GapSize;
  /** Vertical alignment (align-items) */
  align?: Align;
  /** Horizontal alignment (justify-content) */
  justify?: Justify;
}

function resolveDirection(direction: FlexProps["direction"] | undefined): string[] {
  if (!direction) return [];

  if (typeof direction === "string") {
    return [`flex-${direction}`];
  }

  const classes: string[] = [];
  if (direction.mobile) classes.push(`flex-${direction.mobile}`);
  if (direction.tablet) classes.push(`sm:flex-${direction.tablet}`);
  if (direction.desktop) classes.push(`md:flex-${direction.desktop}`);
  return classes;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      asChild = false,
      children,
      direction,
      wrap,
      gap = "md",
      align,
      justify,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.div;
    const directionClasses = resolveDirection(direction);

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex",
          wrap && "flex-wrap",
          gap && gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          directionClasses,
          className,
        )}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  },
);
Flex.displayName = "Flex";

export { Flex };
export default Flex;

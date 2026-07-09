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

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as child via Radix Slot */
  asChild?: boolean;
  /** Gap between stacked items */
  gap?: GapSize;
  /** Vertical alignment (align-items) */
  align?: Align;
  /** Horizontal alignment (justify-content) */
  justify?: Justify;
  /** Show a divider line between items (border-t for all non-first children) */
  divider?: boolean;
  /** Custom divider border color */
  dividerColor?: string;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      asChild = false,
      children,
      gap = "md",
      align,
      justify,
      divider = false,
      dividerColor,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.div;

    const items = React.Children.toArray(children);

    const rendered = divider
      ? items.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={cn(
                  "w-full border-t",
                  dividerColor ? "" : "border-border",
                )}
                style={dividerColor ? { borderColor: dividerColor } : undefined}
                aria-hidden="true"
              />
            )}
            {child}
          </React.Fragment>
        ))
      : children;

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex flex-col",
          gap && gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          className,
        )}
        {...(props as any)}
      >
        {rendered}
      </Comp>
    );
  },
);
Stack.displayName = "Stack";

export { Stack };
export default Stack;

"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface HighlightProps extends EditableProps, HTMLAttributes<HTMLElement> {
  color?: string;
}

const Highlight = forwardRef<HTMLElement, HighlightProps>(
  ({ children, color = "rgba(231,228,255,0.6)", className, style, ...props }, ref) => {
    return (
      <mark
        ref={ref}
        className={cn("px-1 py-0.5 rounded text-inherit bg-amber-100", className)}
        style={{
          backgroundColor: color,
          ...style,
        }}
        {...props}
      >
        {children}
      </mark>
    );
  }
);

Highlight.displayName = "Highlight";
export default Highlight;
export { Highlight };

"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface GradientTextProps extends EditableProps, HTMLAttributes<HTMLSpanElement> {
  gradient?: string;
}

const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ children, gradient = "from-blue-500 to-purple-600", className, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "bg-clip-text text-transparent bg-gradient-to-r font-bold",
          className
        )}
        style={{
          backgroundImage: `linear-gradient(to right, ${gradient})`,
          ...style,
        }}
        {...props}
      >
        {children}
      </span>
    );
  }
);

GradientText.displayName = "GradientText";
export default GradientText;
export { GradientText };

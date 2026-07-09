"use client";

import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { BadgeProps } from "../../types";

// ── Maps ──

const VARIANT_CLASS: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  outline: "border border-border text-foreground",
  soft: "bg-muted text-muted-foreground",
  solid: "bg-primary text-primary-foreground",
  dot: "",
};

const SIZE_CLASS: Record<string, string> = {
  xs: "text-xs px-1.5 py-0.5",
  sm: "text-sm px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1",
};

// ── Component ──

interface ExtendedBadgeProps extends BadgeProps {
  children?: ReactNode;
}

function Badge(
  {
    variant = "default",
    size = "sm",
    color,
    dotColor,
    className,
    style,
    children,
    ...rest
  }: ExtendedBadgeProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const isDot = variant === "dot";

  const inlineStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...style,
  };

  return (
    <motion.div className="inline-flex">
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium",
          VARIANT_CLASS[variant] ?? VARIANT_CLASS.default,
          SIZE_CLASS[size] ?? SIZE_CLASS.sm,
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {isDot && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: dotColor ?? "currentColor",
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    </motion.div>
  );
}

const ForwardedBadge = forwardRef(Badge);
ForwardedBadge.displayName = "Badge";

export default ForwardedBadge;
export { ForwardedBadge as Badge };

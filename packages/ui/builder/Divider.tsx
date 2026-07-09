"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

// ── Styles ──

const borderStyles: Record<string, string> = {
  solid: "border-border",
  dashed: "border-dashed border-border",
  dotted: "border-dotted border-border",
};

const gradientHoriz =
  "h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent";
const gradientVert =
  "w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent";

const labelPositionStyles: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

// ── Props ──

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout direction */
  orientation?: "horizontal" | "vertical";
  /** Thickness in px (applied as border-width or min-width/height) */
  size?: number;
  /** Visual style */
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  /** Optional text label (horizontal only) */
  label?: string;
  /** Label alignment */
  labelPosition?: "left" | "center" | "right";
  /** Custom border colour */
  color?: string;
}

// ── Component ──

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      size = 1,
      variant = "solid",
      label,
      labelPosition = "center",
      color,
      style,
      ...props
    },
    ref,
  ) => {
    const isHoriz = orientation === "horizontal";
    const isGradient = variant === "gradient";

    const borderClass = !isGradient
      ? borderStyles[variant] ?? borderStyles.solid
      : "";

    const customBorderColor =
      color && !isGradient ? { borderColor: color } : undefined;

    // ── No-label horizontal: simple border element ──
    if (isHoriz && !label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn(
            "w-full",
            !isGradient && "border-t",
            isGradient ? gradientHoriz : borderClass,
            className,
          )}
          style={{
            ...(isGradient && color ? { "--divider-color": color } : {}),
            ...customBorderColor,
            borderTopWidth: isGradient ? 0 : size,
            ...style,
          }}
          {...props}
        />
      );
    }

    // ── Vertical divider ──
    if (!isHoriz) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "inline-flex self-stretch",
            !isGradient && "border-l",
            isGradient ? gradientVert : borderClass,
            className,
          )}
          style={{
            ...customBorderColor,
            borderLeftWidth: isGradient ? 0 : size,
            minHeight: "1em",
            ...style,
          }}
          {...props}
        />
      );
    }

    // ── Horizontal with label ──
    const lineBase = "flex-1 self-center";
    const lineBorder = !isGradient
      ? cn("border-t", borderClass)
      : gradientHoriz;

    const lineStyle: React.CSSProperties = {
      ...customBorderColor,
      borderTopWidth: isGradient ? 0 : size,
      ...(isGradient && color ? { "--divider-color": color } : {}),
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          "flex w-full items-center gap-3",
          labelPositionStyles[labelPosition],
          className,
        )}
        style={style}
        {...props}
      >
        <span className={cn(lineBase, lineBorder)} style={lineStyle} />
        {label && (
          <span className="shrink-0 text-xs font-medium text-muted-foreground whitespace-nowrap select-none">
            {label}
          </span>
        )}
        <span className={cn(lineBase, lineBorder)} style={lineStyle} />
      </div>
    );
  },
);
Divider.displayName = "Divider";

export { Divider };
export default Divider;

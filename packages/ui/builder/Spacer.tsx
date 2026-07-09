"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

// ── Helpers ──

const variantStyles = {
  default: "",
  line: "border-t border-border",
  dashed: "border-t border-dashed border-border",
  dotted: "border-t border-dotted border-border",
  gradient:
    "h-px bg-gradient-to-r from-transparent via-border to-transparent border-none",
} as const;

const heightToPx = (h: number | string): string =>
  typeof h === "number" ? `${h}px` : h;

let _uidCounter = 0;
const uid = () => `spacer-${++_uidCounter}`;

// ── Props ──

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Static height in px or any CSS unit (default 16) */
  height?: number | string;
  /** Responsive heights keyed by breakpoint */
  responsive?: {
    desktop?: number | string;
    tablet?: number | string;
    mobile?: number | string;
  };
  /** Background colour */
  bgColor?: string;
  /** Visual variant */
  variant?: "default" | "line" | "dashed" | "dotted" | "gradient";
}

// ── Component ──

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      className,
      height = 16,
      responsive,
      bgColor,
      variant = "default",
      style,
      ...props
    },
    ref,
  ) => {
    const [id] = React.useState(uid);

    // ── Responsive style injection ──
    const heightCss = React.useMemo(() => {
      if (!responsive) return null;

      const d = responsive.desktop ?? height;
      const t = responsive.tablet ?? d;
      const m = responsive.mobile ?? t;

      return `
        .${id} {
          min-height: ${heightToPx(m)};
        }
        @media (min-width: 640px) {
          .${id} { min-height: ${heightToPx(t)}; }
        }
        @media (min-width: 1024px) {
          .${id} { min-height: ${heightToPx(d)}; }
        }
      `;
    }, [responsive, height, id]);

    const isResponsive = !!responsive;

    // ── Inline fallback height (non-responsive) ──
    const resolvedHeight = isResponsive ? undefined : heightToPx(height);

    const isLine = variant !== "default";
    const isGradient = variant === "gradient";

    const combinedStyle: React.CSSProperties = {
      ...(resolvedHeight ? { minHeight: resolvedHeight } : {}),
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...style,
    };

    return (
      <>
        {heightCss && <style>{heightCss}</style>}
        <div
          ref={ref}
          className={cn(
            "w-full",
            isLine && !isGradient && variantStyles[variant],
            isGradient && variantStyles.gradient,
            isResponsive && id,
            className,
          )}
          style={combinedStyle}
          role="separator"
          aria-orientation="horizontal"
          {...props}
        />
      </>
    );
  },
);
Spacer.displayName = "Spacer";

export { Spacer };
export default Spacer;

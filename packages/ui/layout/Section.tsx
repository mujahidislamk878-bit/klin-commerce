"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";
import type { RoundedSize, ShadowSize } from "../../types";

const widthStyles = {
  full: "w-full",
  contained: "mx-auto max-w-7xl",
  wide: "mx-auto max-w-5xl",
  narrow: "mx-auto max-w-3xl",
} as const;

const radiusMap: Record<RoundedSize, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const shadowMap: Record<ShadowSize, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  float: "shadow-xl shadow-black/5 dark:shadow-white/5",
  lift: "shadow-lg hover:shadow-xl transition-shadow duration-300",
  soft: "shadow-md shadow-black/5 dark:shadow-white/5",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as child via Radix Slot (bypasses outer <section>) */
  asChild?: boolean;
  /** Width constraint for the inner content area */
  width?: keyof typeof widthStyles;
  /** Apply vertical padding (py-12 sm:py-16 lg:py-24) */
  paddingY?: boolean;
  /** Apply horizontal padding (px-4 sm:px-6 lg:px-8) */
  paddingX?: boolean;
  /** Background color (applied to the outer wrapper) */
  bgColor?: string;
  /** Background image URL (applied as inline style to outer wrapper) */
  bgImage?: string;
  /** Border radius size */
  radius?: RoundedSize;
  /** Toggle border */
  border?: boolean;
  /** Shadow size */
  shadow?: ShadowSize;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      asChild = false,
      children,
      width = "contained",
      paddingY = true,
      paddingX = true,
      bgColor,
      bgImage,
      radius,
      border,
      shadow,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : motion.section;

    const outerClasses = cn(
      radius && radiusMap[radius],
      border && "border border-border",
      shadow && shadowMap[shadow],
    );

    const innerClasses = cn(
      widthStyles[width],
      paddingX && "px-4 sm:px-6 lg:px-8",
      paddingY && "py-12 sm:py-16 lg:py-24",
    );

    const outerStyle: React.CSSProperties = {
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...(bgImage
        ? {
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {}),
      ...style,
    };

    return (
      <Comp ref={ref} className={cn("relative", className)} {...(props as any)}>
        <div className={outerClasses} style={outerStyle}>
          <div className={innerClasses}>{children}</div>
        </div>
      </Comp>
    );
  },
);
Section.displayName = "Section";

export { Section };
export default Section;

"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { getAnimationProps, getInitial, getWhileInView } from "../../utils/animation";
import type { EditableProps, FontWeight, TextAlign, AnimationProps } from "../../types";

export interface TextProps extends EditableProps, AnimationProps {
  children?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?: FontWeight;
  align?: TextAlign;
  color?: string;
  gradient?: string;
  clamp?: number;
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  tracking?: "tight" | "normal" | "wide" | "wider" | "widest";
  as?: "span" | "p" | "div";
}

const SIZE_MAP = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const WEIGHT_MAP = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const LEADING_MAP = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const TRACKING_MAP = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      size = "md",
      weight = "normal",
      align = "left",
      color,
      gradient,
      clamp,
      leading,
      tracking,
      as: Component = "span",
      animation = "none",
      duration = 0.5,
      delay = 0,
      once = true,
      ease = "easeOut",
      className,
      style,
      ...props
    },
    ref
  ) => {
    const hasGradient = !!gradient;
    const { variants, transition } = getAnimationProps({
      animation,
      duration,
      delay,
      once,
      ease,
    });

    const classes = cn(
      SIZE_MAP[size],
      WEIGHT_MAP[weight],
      ALIGN_MAP[align],
      leading && LEADING_MAP[leading],
      tracking && TRACKING_MAP[tracking],
      clamp && "line-clamp-" + clamp,
      hasGradient && "bg-clip-text text-transparent bg-gradient-to-r",
      className
    );

    const mergedStyle = {
      color: hasGradient ? undefined : color,
      backgroundImage: hasGradient ? `linear-gradient(to right, ${gradient})` : undefined,
      ...style,
    };

    if (animation !== "none") {
      const MotionComponent = motion[Component as "span" | "p" | "div"];
      return (
        <MotionComponent
          ref={ref as any}
          initial={getInitial(animation)}
          whileInView={getWhileInView(animation)}
          variants={variants}
          transition={transition}
          viewport={{ once }}
          className={classes}
          style={mergedStyle}
          {...props}
        >
          {children}
        </MotionComponent>
      );
    }

    return (
      <Component ref={ref as any} className={classes} style={mergedStyle} {...props}>
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
export default Text;
export { Text };

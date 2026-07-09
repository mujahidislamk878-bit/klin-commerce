"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { CardProps, RoundedSize, ShadowSize, GapSize } from "../../types";

// ── Maps ──

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

const paddingMap: Record<GapSize, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
  "3xl": "p-16",
};

const hoverMap: Record<string, string> = {
  lift: "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
  border: "transition-colors duration-300 hover:border-primary",
  glow: "transition-shadow duration-300 hover:shadow-[0_0_30px_-10px_var(--primary)]",
};

// ── Component ──

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      radius,
      shadow,
      border,
      hover = "none",
      padding = "md",
      bgColor,
      image,
      imagePosition = "top",
      imageHeight = "200px",
      children,
      href,
      aspectRatio,
      style,
      ...props
    },
    ref,
  ) => {
    const cardStyle: React.CSSProperties = {
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...(aspectRatio ? { aspectRatio } : {}),
      ...(imagePosition === "background" && image
        ? {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : {}),
      ...style,
    };

    const cardClasses = cn(
      "overflow-hidden bg-card text-card-foreground",
      radius && radiusMap[radius],
      shadow && shadowMap[shadow],
      border && "border border-border",
      hover !== "none" && hoverMap[hover],
      className,
    );

    const renderImage =
      image && imagePosition !== "background" ? (
        <img
          src={image}
          alt=""
          className={cn(
            "w-full object-cover",
            imagePosition === "top" && "rounded-t-[inherit]",
            imagePosition === "bottom" && "rounded-b-[inherit]",
          )}
          style={{ height: imageHeight, objectFit: "cover" }}
        />
      ) : null;

    const renderContent = (
      <>
        {imagePosition === "top" && renderImage}
        <div className={paddingMap[padding as keyof typeof paddingMap] || paddingMap.md}>{children}</div>
        {imagePosition === "bottom" && renderImage}
      </>
    );

    // ── Link variant ──
    if (href) {
      return (
        <motion.a
          ref={ref as any}
          href={href}
          className={cardClasses}
          style={cardStyle}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...(props as any)}
        >
          {renderContent}
        </motion.a>
      );
    }

    // ── Default div ──
    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        style={cardStyle}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {renderContent}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

export { Card };
export default Card;

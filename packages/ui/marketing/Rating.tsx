"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "../../utils/cn";
import type { RatingProps } from "../../types";

// ── Maps ──

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

// ── Component ──

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      max = 5,
      size = "md",
      color = "#f59e0b",
      showValue = false,
      interactive = false,
      ...props
    },
    ref,
  ) => {
    const [hoveredValue, setHoveredValue] = useState<number | null>(null);
    const displayValue = hoveredValue ?? value;
    const roundedValue = Math.round(displayValue);

    return (
      <motion.div
        ref={ref}
        className={cn("inline-flex items-center gap-1", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        {...props}
      >
        <div className="inline-flex items-center gap-0.5">
          {Array.from({ length: max }, (_, i) => {
            const starValue = i + 1;
            const filled = starValue <= roundedValue;

            return (
              <button
                key={i}
                type="button"
                disabled={!interactive}
                className={cn(
                  "transition-transform duration-150",
                  interactive && "cursor-pointer hover:scale-110",
                  !interactive && "cursor-default",
                )}
                onMouseEnter={() => {
                  if (interactive) setHoveredValue(starValue);
                }}
                onMouseLeave={() => {
                  if (interactive) setHoveredValue(null);
                }}
                onClick={() => {
                  if (interactive) setHoveredValue(starValue);
                }}
                aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
                tabIndex={interactive ? 0 : -1}
              >
                <Star
                  className={cn(sizeMap[size], "transition-colors duration-150")}
                  style={{
                    color: filled ? color : undefined,
                    fill: filled ? color : "none",
                    stroke: filled ? color : "currentColor",
                  }}
                />
              </button>
            );
          })}
        </div>

        {showValue && (
          <span className="text-sm font-medium text-muted-foreground ml-0.5">
            {value.toFixed(1)}
          </span>
        )}
      </motion.div>
    );
  },
);

Rating.displayName = "Rating";

export { Rating };
export default Rating;

"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { Circle } from "lucide-react";
import type { TimelineProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";

// ── Variant classes ──

const wrapperVariants: Record<string, string> = {
  default: "space-y-0",
  minimal: "space-y-8",
  horizontal: "flex overflow-x-auto snap-x snap-mandatory gap-8 pb-4",
};

// ── Dot colours ──

const dotColors: Record<string, string> = {
  primary: "bg-primary border-primary",
  muted: "bg-muted-foreground border-muted-foreground",
  accent: "bg-accent border-accent",
};

// ── Component ──

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      items,
      variant = "default",
      color = "primary",
      animated = true,
      ...props
    },
    ref,
  ) => {
    if (!items || items.length === 0) return null;

    const fadeUp = {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4 },
      }),
    };

    // ── Minimal variant ──
    if (variant === "minimal") {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="relative pl-8 border-l-2 border-border"
              custom={i}
              initial={animated ? "hidden" : "visible"}
              whileInView={animated ? "visible" : undefined}
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span
                className={cn(
                  "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2",
                  dotColors[color],
                )}
              />

              <div className="mb-1">
                {item.date && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.date}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    // ── Horizontal variant ──
    if (variant === "horizontal") {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          <div className={wrapperVariants.horizontal}>
            {items.map((item, i) => (
              <motion.div
                key={i}
                className="snap-start shrink-0 w-72 border rounded-xl p-6 bg-card"
                custom={i}
                initial={animated ? "hidden" : "visible"}
                whileInView={animated ? "visible" : undefined}
                viewport={{ once: true }}
                variants={fadeUp}
              >
                {item.date && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.date}
                  </span>
                )}
                <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // ── Default variant (connected vertical timeline) ──
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <motion.div
              key={i}
              className="relative flex gap-6 pb-10 last:pb-0"
              custom={i}
              initial={animated ? "hidden" : "visible"}
              whileInView={animated ? "visible" : undefined}
              viewport={{ once: true }}
              variants={fadeUp}
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 rounded-full border-2 z-10",
                    dotColors[color],
                  )}
                />
                {!isLast && (
                  <div className="w-px flex-1 bg-border min-h-[2rem]" />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1">
                {item.date && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.date}
                  </span>
                )}
                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  },
);

Timeline.displayName = "Timeline";

export { Timeline };
export default Timeline;

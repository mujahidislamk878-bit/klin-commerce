"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { LogoCloudProps } from "../../types";
import { Paragraph } from "../typography/Paragraph";

// ── Component ──

const LogoCloud = forwardRef<HTMLDivElement, LogoCloudProps>(
  (
    {
      className,
      heading,
      logos,
      variant = "default",
      speed = 30,
      ...props
    },
    ref,
  ) => {
    if (!logos || logos.length === 0) return null;

    // ── Scrolling marquee variant ──
    if (variant === "scrolling") {
      // Duplicate logos to create seamless loop
      const duplicated = [...logos, ...logos];

      return (
        <div ref={ref} className={cn("overflow-hidden", className)} {...props}>
          {heading && (
            <div className="text-center mb-8">
              <Paragraph className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {heading}
              </Paragraph>
            </div>
          )}

          <div className="relative">
            <motion.div
              className="flex items-center gap-16"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  duration: speed,
                  ease: "linear",
                },
              }}
            >
              {duplicated.map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center shrink-0 h-10"
                >
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.alt || ""}
                      className="h-full w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    />
                  ) : logo.name ? (
                    <span className="text-lg font-semibold text-muted-foreground">
                      {logo.name}
                    </span>
                  ) : null}
                </div>
              ))}
            </motion.div>

            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>
      );
    }

    // ── Grid variant (default) ──
    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {heading && (
          <div className="text-center mb-8">
            <Paragraph className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {heading}
            </Paragraph>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center h-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt || ""}
                  className="h-full w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />
              ) : logo.name ? (
                <span className="text-lg font-semibold text-muted-foreground">
                  {logo.name}
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  },
);

LogoCloud.displayName = "LogoCloud";

export { LogoCloud };
export default LogoCloud;

"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { TestimonialsProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Quote } from "./Quote";

// ── Variant wrapper classes ──

const wrapperVariants: Record<string, string> = {
  grid: "",
  carousel: "",
  masonry: "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6",
  compact: "",
};

// ── Component ──

const Testimonials = forwardRef<HTMLDivElement, TestimonialsProps>(
  (
    {
      className,
      heading,
      subheading,
      items,
      variant = "grid",
      columns = 3,
      ...props
    },
    ref,
  ) => {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    };

    const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    };

    if (!items || items.length === 0) return null;

    // ── Masonry variant ──
    if (variant === "masonry") {
      return (
        <motion.div
          ref={ref}
          className={cn(className)}
          variants={container}
          initial="hidden"
          animate="show"
          {...props}
        >
          {heading && (
            <Heading level={2} size="3xl" className="mb-2">
              {heading}
            </Heading>
          )}
          {subheading && (
            <Paragraph className="mb-8 text-muted-foreground">
              {subheading}
            </Paragraph>
          )}
          <div className={wrapperVariants.masonry}>
            {items.map((testimonial, i) => (
              <motion.div key={i} variants={item} className="break-inside-avoid mb-6">
                <Quote
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  avatar={testimonial.avatar}
                  variant="default"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    // ── Grid / Carousel / Compact ──
    const gridCols =
      variant === "carousel"
        ? "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-6"
        : columns === 2
          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={container}
        initial="hidden"
        animate="show"
        {...props}
      >
        {heading && (
          <Heading level={2} size="3xl" className="mb-2">
            {heading}
          </Heading>
        )}
        {subheading && (
          <Paragraph className="mb-8 text-muted-foreground">
            {subheading}
          </Paragraph>
        )}
        <div className={cn(gridCols)} role="list">
          {items.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={item}
              className={cn(
                variant === "carousel" && "snap-center shrink-0 w-[85%] md:w-[45%] lg:w-[30%]",
              )}
              role="listitem"
            >
              <Quote
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                avatar={testimonial.avatar}
                variant={variant === "compact" ? "card" : "default"}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  },
);

Testimonials.displayName = "Testimonials";

export { Testimonials };
export default Testimonials;

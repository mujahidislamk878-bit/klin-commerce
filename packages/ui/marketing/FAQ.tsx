"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "../../utils/cn";
import type { FAQProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";

// ── Component ──

const FAQ = forwardRef<HTMLDivElement, FAQProps>(
  (
    {
      className,
      heading,
      subheading,
      items,
      variant = "accordion",
      columns = 2,
      ...props
    },
    ref,
  ) => {
    // Tracks which items are open (accordion = one at a time, no multi)
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
      setOpenIndex((prev) => (prev === i ? null : i));
    };

    if (!items || items.length === 0) return null;

    // ── Inline variant ──
    if (variant === "inline") {
      return (
        <div ref={ref} className={cn(className)} {...props}>
          {(heading || subheading) && (
            <div className="text-center mb-10">
              {heading && (
                <Heading level={2} size="3xl" className="mb-4">
                  {heading}
                </Heading>
              )}
              {subheading && (
                <Paragraph size="lg" className="text-muted-foreground max-w-2xl mx-auto">
                  {subheading}
                </Paragraph>
              )}
            </div>
          )}

          <div className="space-y-6">
            {items.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border pb-5"
              >
                <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // ── Grid variant (flat Q&A row per cell) ──
    if (variant === "grid") {
      const gridCols =
        columns === 3
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "grid grid-cols-1 md:grid-cols-2 gap-8";

      return (
        <div ref={ref} className={cn(className)} {...props}>
          {(heading || subheading) && (
            <div className="text-center mb-10">
              {heading && (
                <Heading level={2} size="3xl" className="mb-4">
                  {heading}
                </Heading>
              )}
              {subheading && (
                <Paragraph size="lg" className="text-muted-foreground max-w-2xl mx-auto">
                  {subheading}
                </Paragraph>
              )}
            </div>
          )}

          <div className={gridCols}>
            {items.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // ── Accordion variant (default) ──
    return (
      <div ref={ref} className={cn("mx-auto max-w-3xl", className)} {...props}>
        {(heading || subheading) && (
          <div className="text-center mb-10">
            {heading && (
              <Heading level={2} size="3xl" className="mb-4">
                {heading}
              </Heading>
            )}
            {subheading && (
              <Paragraph size="lg" className="text-muted-foreground max-w-2xl mx-auto">
                {subheading}
              </Paragraph>
            )}
          </div>
        )}

        <div className="divide-y divide-border rounded-xl border">
          {items.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={i} className="group">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
                    "text-sm font-medium transition-colors",
                    "hover:bg-muted/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {isOpen ? (
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      key={`panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

FAQ.displayName = "FAQ";

export { FAQ };
export default FAQ;

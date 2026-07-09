"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "../../utils/cn";
import type { PricingProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Button } from "../buttons/Button";

// ── Variant wrapper classes ──

const gridVariants: Record<string, string> = {
  default: "grid grid-cols-1 md:grid-cols-3 gap-8",
  card: "grid grid-cols-1 md:grid-cols-3 gap-8",
  compact: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  bordered: "grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border",
};

const planCardVariants: Record<string, string> = {
  default:
    "rounded-2xl border bg-card p-8 flex flex-col",
  card:
    "rounded-2xl border bg-card p-8 flex flex-col shadow-sm hover:shadow-lg transition-shadow",
  compact:
    "rounded-xl border bg-card p-6 flex flex-col",
  bordered:
    "p-8 flex flex-col",
};

// ── Component ──

const Pricing = forwardRef<HTMLDivElement, PricingProps>(
  (
    {
      className,
      heading,
      subheading,
      plans,
      variant = "default",
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

    const itemAnim = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    };

    if (!plans || plans.length === 0) return null;

    return (
      <motion.div
        ref={ref}
        className={cn(className)}
        variants={container}
        initial="hidden"
        animate="show"
        {...props}
      >
        {(heading || subheading) && (
          <div className="text-center mb-12">
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

        <div className={gridVariants[variant]}>
          {plans.map((plan, i) => {
            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={i}
                variants={itemAnim}
                className={cn(
                  planCardVariants[variant],
                  isHighlighted &&
                    "relative border-primary/50 shadow-lg shadow-primary/10 scale-105 z-10",
                )}
              >
                {isHighlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </span>
                )}

                {/* Name & Price */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <Paragraph className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </Paragraph>
                  )}
                </div>

                {/* CTA */}
                {plan.cta && (
                  <Button
                    href={plan.cta.href}
                    variant={isHighlighted ? "primary" : "outline"}
                    className="w-full mb-6"
                  >
                    {plan.cta.label}
                  </Button>
                )}

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, j) => {
                      const enabled = feature.enabled ?? true;
                      return (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          {enabled ? (
                            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                          ) : (
                            <X className="h-4 w-4 mt-0.5 text-muted-foreground/40 shrink-0" aria-hidden="true" />
                          )}
                          <span
                            className={cn(
                              enabled ? "text-foreground" : "text-muted-foreground/50 line-through",
                            )}
                          >
                            {feature.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  },
);

Pricing.displayName = "Pricing";

export { Pricing };
export default Pricing;

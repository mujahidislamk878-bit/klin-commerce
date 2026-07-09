"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { CTAProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Button } from "../buttons/Button";
import { Container } from "../layout/Container";

// ── Variant classes ──

const wrapperClasses: Record<string, string> = {
  default: "bg-muted/50 border-y border-border",
  card: "rounded-2xl border bg-card shadow-sm",
  minimal: "",
  fullWidth: "bg-primary text-primary-foreground",
};

const headingVariants: Record<string, string> = {
  default: "",
  card: "",
  minimal: "",
  fullWidth: "text-primary-foreground",
};

const paragraphVariants: Record<string, string> = {
  default: "text-muted-foreground",
  card: "text-muted-foreground",
  minimal: "text-muted-foreground",
  fullWidth: "text-primary-foreground/80",
};

// ── Component ──

const CTA = forwardRef<HTMLDivElement, CTAProps>(
  (
    {
      className,
      heading,
      subheading,
      primaryCta,
      secondaryCta,
      variant = "default",
      bgColor,
      bgImage,
      gradient,
      style,
      ...props
    },
    ref,
  ) => {
    const ctaStyle: React.CSSProperties = {
      ...(bgColor ? { backgroundColor: bgColor } : {}),
      ...(bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
      ...(gradient ? { backgroundImage: gradient } : {}),
      ...style,
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "py-16 lg:py-20",
          wrapperClasses[variant],
          variant === "card" && "mx-auto max-w-4xl px-8 lg:px-12",
          variant === "fullWidth" && "py-20 lg:py-28",
          className,
        )}
        style={ctaStyle}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        <Container>
          <div
            className={cn(
              "flex flex-col items-center text-center",
              variant === "default" && "mx-auto max-w-2xl",
            )}
          >
            <Heading
              level={2}
              size="3xl"
              weight="bold"
              className={cn("mb-4", headingVariants[variant])}
            >
              {heading}
            </Heading>

            {subheading && (
              <Paragraph
                size="lg"
                className={cn("mb-8 max-w-xl", paragraphVariants[variant])}
              >
                {subheading}
              </Paragraph>
            )}

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap justify-center gap-4">
                {primaryCta && (
                  <Button
                    href={primaryCta.href}
                    size="lg"
                    variant={variant === "fullWidth" ? "secondary" : "primary"}
                  >
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    href={secondaryCta.href}
                    size="lg"
                    variant={variant === "fullWidth" ? "ghost" : "outline"}
                    className={variant === "fullWidth" ? "text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10" : ""}
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </motion.div>
    );
  },
);

CTA.displayName = "CTA";

export { CTA };
export default CTA;

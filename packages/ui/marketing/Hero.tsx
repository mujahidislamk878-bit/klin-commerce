"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { HeroProps } from "../../types";
import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Button } from "../buttons/Button";
import { Container } from "../layout/Container";

// ── Maps ──

const variantClasses: Record<string, string> = {
  default: "py-20 lg:py-28",
  centered: "py-20 lg:py-28 text-center",
  split: "py-12 lg:py-20",
  fullscreen: "min-h-screen flex items-center",
  minimal: "py-16 lg:py-20",
};

// ── Component ──

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      className,
      heading,
      subheading,
      primaryCta,
      secondaryCta,
      image,
      imagePosition = "right",
      overlay,
      variant = "default",
      height,
      gradient,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const heroStyle: React.CSSProperties = {
      ...(height ? { minHeight: height } : {}),
      ...(image && variant === "fullscreen"
        ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {}),
      ...(gradient ? { backgroundImage: gradient } : {}),
      ...style,
    };

    const renderOverlay = overlay && variant === "fullscreen" ? (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlay }}
        aria-hidden="true"
      />
    ) : null;

    const renderContent = (
      <div className={cn(
        "relative z-10",
        variant === "centered" && "mx-auto max-w-4xl",
        variant === "split" && "flex-1",
      )}>
        <Heading level={1} size="5xl" weight="bold" leading="tight" className="mb-4">
          {heading}
        </Heading>

        {subheading && (
          <Paragraph size="lg" className="mb-8 max-w-2xl text-muted-foreground">
            {subheading}
          </Paragraph>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={cn(
            "flex flex-wrap gap-4",
            variant === "centered" && "justify-center",
          )}>
            {primaryCta && (
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}

        {children}
      </div>
    );

    const renderImage = image && imagePosition !== "background" && imagePosition !== "later" && variant !== "fullscreen" ? (
      <div className={cn(
        "flex-1 flex items-center justify-center",
        imagePosition === "left" && "order-first",
      )}>
        <img
          src={image}
          alt=""
          className="w-full h-auto max-w-lg rounded-2xl object-cover"
        />
      </div>
    ) : null;

    // ── Fullscreen variant ──
    if (variant === "fullscreen") {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "relative overflow-hidden",
            variantClasses[variant],
            className,
          )}
          style={heroStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          {...props}
        >
          {renderOverlay}
          <Container className="relative z-10 text-center">
            {renderContent}
          </Container>
        </motion.div>
      );
    }

    // ── Minimal variant ──
    if (variant === "minimal") {
      return (
        <motion.div
          ref={ref}
          className={cn(
            variantClasses[variant],
            className,
          )}
          style={heroStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          {...props}
        >
          <Container>
            {renderContent}
          </Container>
        </motion.div>
      );
    }

    // ── Split variant ──
    if (variant === "split") {
      return (
        <motion.div
          ref={ref}
          className={cn(
            variantClasses[variant],
            className,
          )}
          style={heroStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          {...props}
        >
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {imagePosition === "left" ? (
                <>
                  {renderImage}
                  {renderContent}
                </>
              ) : (
                <>
                  {renderContent}
                  {renderImage}
                </>
              )}
            </div>
          </Container>
        </motion.div>
      );
    }

    // ── Default / Centered ──
    return (
      <motion.div
        ref={ref}
        className={cn(
          variantClasses[variant],
          className,
        )}
        style={heroStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        <Container>
          {renderContent}
          {image && imagePosition === "later" && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src={image}
                alt=""
                className="w-full h-auto max-w-5xl mx-auto rounded-2xl object-cover shadow-xl"
              />
            </motion.div>
          )}
        </Container>
      </motion.div>
    );
  },
);

Hero.displayName = "Hero";

export { Hero };
export default Hero;

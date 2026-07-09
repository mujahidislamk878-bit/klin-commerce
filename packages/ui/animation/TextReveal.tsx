"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

type TextVariant = "word" | "character" | "line";

export interface TextRevealProps {
  text: string;
  variant?: TextVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

// ── Component ──

const TextReveal = forwardRef<HTMLDivElement, TextRevealProps>(
  (
    {
      text,
      variant = "word",
      delay = 0,
      duration = 0.5,
      once = true,
      className,
    },
    ref,
  ) => {
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: delay * i },
      }),
    };

    const child = {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          damping: 15,
          stiffness: 200,
          duration,
        },
      },
      hidden: {
        opacity: 0,
        y: 30,
        transition: {
          type: "spring" as const,
          damping: 15,
          stiffness: 200,
          duration,
        },
      },
    };

    // ── Word split ──
    if (variant === "word") {
      const words = text.split(" ");
      return (
        <motion.div
          ref={ref}
          className={cn("inline-flex flex-wrap", className)}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      );
    }

    // ── Character split ──
    if (variant === "character") {
      const chars = text.split("");
      return (
        <motion.div
          ref={ref}
          className={cn("inline-flex flex-wrap", className)}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once }}
        >
          {chars.map((char, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      );
    }

    // ── Line split ──
    if (variant === "line") {
      const lines = text.split("\n");
      return (
        <motion.div
          ref={ref}
          className={cn(className)}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once }}
        >
          {lines.map((line, index) => (
            <motion.div key={index} variants={child} className="overflow-hidden">
              <motion.span className="block">{line}</motion.span>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return <span ref={ref as any}>{text}</span>;
  },
);

TextReveal.displayName = "TextReveal";

export { TextReveal };
export default TextReveal;

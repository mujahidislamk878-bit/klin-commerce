"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface AnimatedTextProps extends EditableProps {
  text: string;
  once?: boolean;
  stagger?: number;
}

const AnimatedText = forwardRef<HTMLDivElement, AnimatedTextProps>(
  ({ text, once = true, stagger = 0.05, className, ...props }, ref) => {
    const words = text.split(" ");

    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
        },
      },
    };

    const childVariants = {
      hidden: {
        opacity: 0,
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          damping: 12,
          stiffness: 100,
        },
      },
    };

    return (
      <motion.div
        ref={ref as any}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        className={cn("flex flex-wrap gap-x-1.5 text-[#0F1020]", className)}
        {...props}
      >
        {words.map((word, idx) => (
          <motion.span key={idx} variants={childVariants} className="inline-block">
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";
export default AnimatedText;
export { AnimatedText };

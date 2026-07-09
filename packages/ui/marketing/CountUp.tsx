"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../utils/cn";
import type { CountUpProps } from "../../types";

// ── Helpers ──

function formatNumber(n: number, separator?: string): string {
  if (!separator) return String(n);
  const parts = n.toFixed(0).split("");
  const out: string[] = [];
  let count = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    out.unshift(parts[i]);
    count++;
    if (count % 3 === 0 && i !== 0) out.unshift(separator);
  }
  return out.join("");
}

// ── Component ──

const CountUp = forwardRef<HTMLDivElement, CountUpProps>(
  (
    {
      className,
      end,
      start = 0,
      duration = 2,
      separator = ",",
      prefix = "",
      suffix = "",
      label,
      decimals = 0,
      ...props
    },
    ref,
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDivElement | null>) ?? localRef;
    const isInView = useInView(resolvedRef, { once: true, margin: "0px 0px -80px 0px" });
    const [current, setCurrent] = useState(start);
    const rafRef = useRef<number | null>(null);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
      if (!isInView) return;

      const delta = end - start;
      startTime.current = null;

      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp;
        const elapsed = (timestamp - startTime.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = start + delta * eased;

        setCurrent(value);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCurrent(end);
        }
      };

      rafRef.current = requestAnimationFrame(animate);

      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }, [isInView, start, end, duration]);

    return (
      <motion.div
        ref={resolvedRef}
        className={cn("text-center", className)}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        {...props}
      >
        <span className="block text-4xl font-extrabold tabular-nums tracking-tight">
          {prefix}{formatNumber(Math.round(current), separator)}{suffix}
        </span>
        {label && (
          <span className="mt-1 block text-sm text-muted-foreground">
            {label}
          </span>
        )}
      </motion.div>
    );
  },
);

CountUp.displayName = "CountUp";

export { CountUp };
export default CountUp;

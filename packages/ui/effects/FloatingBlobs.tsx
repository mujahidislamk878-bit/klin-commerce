"use client";

import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// ── Types ──

export interface FloatingBlobsProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

// ── Default colors ──

const defaultColors = [
  "#E7E4FF",
  "#DFF7EE",
  "#E5F1FF",
  "#FFF7E9",
  "#FFE4E4",
  "#E8F4FD",
];

// ── Generate blob data ──

interface BlobData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  floatX: number[];
  floatY: number[];
  duration: number;
}

function generateBlobs(count: number, colors: string[], minSize: number, maxSize: number, speed: number): BlobData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: minSize + Math.random() * (maxSize - minSize),
    color: colors[i % colors.length],
    floatX: [
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
    ],
    floatY: [
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60,
    ],
    duration: 8 + Math.random() * 12 / speed,
  }));
}

// ── Component ──

const FloatingBlobs = forwardRef<HTMLDivElement, FloatingBlobsProps>(
  (
    {
      count = 3,
      colors = defaultColors,
      minSize = 100,
      maxSize = 300,
      speed = 1,
      className,
    },
    ref,
  ) => {
    const blobs = useMemo(
      () => generateBlobs(count, colors, minSize, maxSize, speed),
      [count, colors, minSize, maxSize, speed],
    );

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
          className,
        )}
        aria-hidden="true"
      >
        {blobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: blob.size,
              height: blob.size,
              background: blob.color,
              opacity: 0.6,
            }}
            animate={{
              x: blob.floatX,
              y: blob.floatY,
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  },
);

FloatingBlobs.displayName = "FloatingBlobs";

export { FloatingBlobs };
export default FloatingBlobs;

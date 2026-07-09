"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function MagneticButton({ children, variant = "primary", className = "", ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base = "relative inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-medium transition-shadow shadow-soft";
  const skin = variant === "primary"
    ? "bg-[#0F1020] text-white hover:shadow-float"
    : "bg-white/70 backdrop-blur border border-black/5 text-[#0F1020] hover:bg-white";

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${skin} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

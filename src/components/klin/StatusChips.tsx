"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const chips = [
  { label: "Live Editing", dot: "#6A5AE0" },
  { label: "Draft Saved",  dot: "#0EA36B" },
  { label: "Responsive",   dot: "#2563EB" },
  { label: "Published",    dot: "#D97706" },
];

export function StatusChips() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % chips.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="floating-card flex items-center gap-2 px-4 py-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={chips[i].label}
            initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 text-[13px] font-medium text-[#0F1020]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: chips[i].dot }} />
              <span className="relative inline-block h-2.5 w-2.5 rounded-full" style={{ background: chips[i].dot }} />
            </span>
            {chips[i].label}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { templates } from "@/lib/klin-templates";
import { TemplateThumbnail } from "./TemplateThumbnail";

type HeroCardConfig = {
  id: string;
  templateIndex: number;
  row: number;
  col: number;
  rotate: number;
  direction: 1 | -1;
};

export function TemplateUniverse() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const cards = useMemo<HeroCardConfig[]>(() => [
    { id: "hero-1", templateIndex: 0, row: 0, col: 0, rotate: 10, direction: 1 },
    { id: "hero-2", templateIndex: 1, row: 0, col: 1, rotate: 8, direction: 1 },
    { id: "hero-3", templateIndex: 2, row: 0, col: 2, rotate: 12, direction: 1 },
    { id: "hero-4", templateIndex: 3, row: 1, col: 0, rotate: 6, direction: 1 },
    { id: "hero-5", templateIndex: 4, row: 1, col: 1, rotate: 9, direction: 1 },
    { id: "hero-6", templateIndex: 5, row: 1, col: 2, rotate: 7, direction: 1 },
    { id: "hero-7", templateIndex: 6, row: 2, col: 0, rotate: 5, direction: 1 },
    { id: "hero-8", templateIndex: 7, row: 2, col: 1, rotate: 8, direction: 1 },
    { id: "hero-9", templateIndex: 8, row: 2, col: 2, rotate: 11, direction: 1 },
  ], []);

  return (
    <div ref={ref} className="relative h-[700px] w-full overflow-visible lg:h-[780px]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(106,90,224,0.14),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,163,107,0.14),_transparent_45%)]" />
      {cards.map((card, index) => (
        <HeroGridCard key={card.id} card={card} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

function HeroGridCard({ card, scrollYProgress }: { card: HeroCardConfig; scrollYProgress: MotionValue<number> }) {
  const lefts = ["10%", "48%", "86%"];
  const baseTop = 12 + card.row * 32;
  const x = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [baseTop, baseTop - 90]);
  const rotate = useTransform(scrollYProgress, [0, 1], [card.rotate, card.rotate + 8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.92, 1, 1, 0.8]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: lefts[card.col],
        top: `${baseTop}%`,
        x,
        y,
        rotate,
        opacity,
      }}
      className="relative"
    >
      <div className="floating-card relative h-[280px] w-[260px] overflow-hidden rounded-[28px] border border-white/0 bg-white/95 shadow-none">
        <TemplateThumbnail template={templates[card.templateIndex]} compact={true} />
      </div>
    </motion.div>
  );
}

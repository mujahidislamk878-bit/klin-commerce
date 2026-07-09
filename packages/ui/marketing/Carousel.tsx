"use client";

import { forwardRef, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import type { CarouselProps } from "../../types";

// ── Variant styles ──

const itemBase = "shrink-0 w-full";

// ── Component ──

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      items,
      autoPlay = true,
      interval = 3000,
      showArrows = true,
      showDots = true,
      loop = true,
      variant = "default",
      gap,
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const total = items.length;

    // ── Navigation ──

    const goTo = useCallback(
      (index: number) => {
        if (!loop && (index < 0 || index >= total)) return;
        const next = ((index % total) + total) % total;
        setDirection(next > current || (loop && next < current) ? 1 : -1);
        setCurrent(next);
      },
      [total, current, loop],
    );

    const next = useCallback(() => goTo(current + 1), [goTo, current]);
    const prev = useCallback(() => goTo(current - 1), [goTo, current]);

    // ── Auto-play ──

    useEffect(() => {
      if (!autoPlay || isPaused || total <= 1) return;
      timerRef.current = setInterval(next, interval);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [autoPlay, isPaused, interval, next, total]);

    // ── Swipe handlers ──

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    };

    // ── Slide variants ──

    const slideVariants = {
      enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
      center: { x: "0%", opacity: 1 },
      exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    const fadeVariants = {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };

    // ── Card peek style ──

    const cardContainerClass =
      variant === "card"
        ? "overflow-visible -mx-4"
        : "overflow-hidden";

    const cardItemWrapperClass =
      variant === "card"
        ? "flex gap-4 px-4"
        : "flex";

    if (!items || items.length === 0) return null;

    return (
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Carousel"
        aria-roledescription="carousel"
        {...props}
      >
        {/* Slides container */}
        <div className={cn(cardContainerClass, "rounded-xl")}>
          {variant === "fade" ? (
            <div className="relative" style={{ minHeight: "200px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={fadeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={itemBase}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${current + 1} of ${total}`}
                >
                  {items[current]}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className={cn(cardContainerClass, cardItemWrapperClass)}>
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={itemBase}
                  style={gap ? { paddingRight: gap } : undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${current + 1} of ${total}`}
                >
                  {items[current]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Arrows */}
        {showArrows && total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "inline-flex items-center justify-center h-10 w-10 rounded-full",
                "bg-background/80 backdrop-blur-sm border shadow-sm",
                "hover:bg-accent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !loop && current === 0 && "opacity-40 cursor-not-allowed",
              )}
              disabled={!loop && current === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "inline-flex items-center justify-center h-10 w-10 rounded-full",
                "bg-background/80 backdrop-blur-sm border shadow-sm",
                "hover:bg-accent transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !loop && current === total - 1 && "opacity-40 cursor-not-allowed",
              )}
              disabled={!loop && current === total - 1}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && total > 1 && (
          <div
            className="flex items-center justify-center gap-2 mt-4"
            role="tablist"
            aria-label="Slide indicators"
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  },
);

Carousel.displayName = "Carousel";

export { Carousel };
export default Carousel;

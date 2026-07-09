"use client";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-0 py-0 ">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[85vh] overflow-hidden rounded-b-[48px] bg-white">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex min-h-[85vh] flex-col rounded-b-[48px]">
            <header className="sticky top-6 z-20 mx-auto flex w-full max-w-[38vw] min-w-[280px] items-center justify-between gap-4 rounded-[36px] border border-white/30 bg-white/90 px-4 py-2 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:max-w-[90vw]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[24px] bg-white text-slate-950 shadow-sm">
                  <span className="font-display text-lg">K</span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-950/90">Klin</p>
                  <p className="text-xs text-slate-950/60">Modern website experiences</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 hover:bg-slate-100">
                  Get Started
                </button>
                <button className="rounded-full border border-white/70 bg-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/50">
                  Watch Video
                </button>
              </div>
            </header>

            <main className="mx-auto flex flex-1 w-full max-w-[1200px] items-start px-6 pb-0 pt-2 md:px-10">
              <div className="max-w-3xl space-y-6 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-white/70">Launch your story</p>
                  <h1 className="text-5xl font-display leading-[0.95] tracking-[-0.03em] text-white md:text-6xl">
                    Build a beautiful website fast.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                    Experience a powerful visual page builder designed for modern brands. Create stunning, high-converting websites without touching a single line of code. Perfect for agencies, startups, and enterprises that demand polished results delivered today.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <MagneticButton>Start building</MagneticButton>
                    <MagneticButton variant="ghost">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View templates
                    </MagneticButton>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

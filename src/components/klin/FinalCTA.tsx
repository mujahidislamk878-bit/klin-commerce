"use client";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

export function FinalCTA() {
  return (
    <section className="relative w-full px-0 py-32">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full overflow-hidden rounded-[40px] bg-[#0F1020] p-14 text-white shadow-lift md:p-24"
          >
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "#6A5AE0", opacity: 0.5 }} />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "#0EA36B", opacity: 0.4 }} />

        <div className="relative max-w-3xl">
          <h2 className="font-display text-6xl leading-[1.02] tracking-[-0.02em] md:text-8xl">
            Stop imagining.
            <span className="block italic text-[#B6FF6C]">Start building.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-white/70">
            Your first website is minutes away.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton>Start Free →</MagneticButton>
            <span className="text-sm text-white/60">No credit card. No lock-in.</span>
          </div>
        </div>

        <div className="relative mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
              <span className="font-display text-lg leading-none text-white">K</span>
            </div>
            <span>Klin — a design studio in a browser tab.</span>
          </div>
          <div className="flex gap-6">
            <span>Templates</span><span>Changelog</span><span>Docs</span><span>Twitter</span>
          </div>
        </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

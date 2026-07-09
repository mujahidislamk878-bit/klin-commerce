"use client";
import { motion } from "framer-motion";
import { templates } from "@/lib/klin-templates";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { useState } from "react";

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const row = [...templates, ...templates];

  return (
    <section className="relative w-full px-0 py-16">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0">
          <div className="w-full rounded-[40px] border border-[#E7E9F2] bg-white shadow-soft">
            <div className="mx-auto max-w-[1500px] px-6 py-16">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-6xl">
                  Built with Klin.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#0F1020]/70">
                  A few of the 120,000+ websites shipped this year.
                </p>
              </div>

              <div
                className="relative mt-10 overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#F6F7FB] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#F6F7FB] to-transparent" />

                <motion.div
                  className="flex gap-6"
                  animate={{ x: paused ? undefined : ["0%", "-50%"] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  {row.map((t, i) => (
                    <div
                      key={`${t.id}-${i}`}
                      className="floating-card group h-[260px] w-[360px] shrink-0 overflow-hidden transition-transform hover:-translate-y-1"
                    >
                      <TemplateThumbnail template={t} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    kicker: "01 — Drag",
    title: "Drag visually.",
    sub: "Snap blocks into place with real physics — no code, no wrestling with a CMS.",
    bg: "#E7E4FF", ink: "#1B143A",
    visual: <DragVisual />,
  },
  {
    kicker: "02 — Customize",
    title: "Customize freely.",
    sub: "Typography, colors, spacing — every knob you'd ever want, none you don't.",
    bg: "#DFF7EE", ink: "#0F2A22",
    visual: <CustomizeVisual />,
  },
  {
    kicker: "03 — Responsive",
    title: "Responsive by default.",
    sub: "Desktop, tablet, mobile — one design, three great renders.",
    bg: "#E5F1FF", ink: "#0B2545",
    visual: <ResponsiveVisual />,
  },
  {
    kicker: "04 — Publish",
    title: "Publish in one click.",
    sub: "Global edge, custom domain, SSL. Live in seconds.",
    bg: "#FFF7E9", ink: "#2A1F10",
    visual: <PublishVisual />,
  },
];

export function Storytelling() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".story-card");
      items.forEach((el, i) => {
        gsap.fromTo(el,
          { yPercent: 60, scale: 0.92, opacity: 0.5 },
          {
            yPercent: 0, scale: 1, opacity: 1,
            scrollTrigger: {
              trigger: el, start: "top 85%", end: "top 30%",
              scrub: 0.6,
            },
          },
        );
        if (i < items.length - 1) {
          gsap.to(el, {
            yPercent: -8, opacity: 0.85, scale: 0.97,
            scrollTrigger: { trigger: el, start: "top 20%", end: "bottom top", scrub: 0.6 },
          });
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative w-full px-0 py-20">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0">
          <div className="w-full rounded-[40px] border border-[#E7E9F2] bg-white shadow-soft">
            <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-7xl">
                  Four steps.
                  <span className="block italic text-[#D97706]">One afternoon.</span>
                </h2>
              </div>

              <div className="mt-16 space-y-16">
                {cards.map((c, i) => (
                  <div
                    key={i}
                    className="story-card relative mx-auto grid min-h-[70vh] max-w-6xl grid-cols-1 items-center gap-10 rounded-[36px] p-10 shadow-lift md:grid-cols-2 md:p-16"
                    style={{ background: c.bg, color: c.ink }}
                  >
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-70">{c.kicker}</div>
                      <h3 className="mt-3 font-display text-5xl leading-[1.02] md:text-7xl">{c.title}</h3>
                      <p className="mt-5 max-w-md text-lg opacity-80">{c.sub}</p>
                    </div>
                    <div className="relative h-[360px]">{c.visual}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DragVisual() {
  return (
    <div className="relative h-full w-full rounded-3xl bg-white/70 p-4 shadow-float">
      {["Hero","Features","Pricing","Footer"].map((b, i) => (
        <motion.div
          key={b}
          initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
          viewport={{ once: false, amount: 0.4 }}
          className="mb-2 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-soft"
        >
          <span className="text-sm font-medium text-[#1B143A]">{b}</span>
          <span className="text-xs text-[#1B143A]/50">⋮⋮</span>
        </motion.div>
      ))}
      <div className="pointer-events-none absolute right-6 top-14 rounded-2xl bg-[#0F1020] px-3 py-1.5 text-[10px] text-white">
        ⇣ dropping…
      </div>
    </div>
  );
}
function CustomizeVisual() {
  return (
    <div className="relative h-full w-full rounded-3xl bg-white/70 p-6 shadow-float">
      <div className="font-display text-4xl text-[#0F2A22]">Aa</div>
      <div className="mt-2 text-sm text-[#0F2A22]/70">Instrument Serif — 42/1.04</div>
      <div className="mt-6 flex gap-2">
        {["#0EA36B","#6A5AE0","#D97706","#2563EB","#E11D74"].map((c) => (
          <motion.div key={c} className="h-10 w-10 rounded-full shadow-soft"
            style={{ background: c }} whileHover={{ scale: 1.1 }} />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {["Spacing","Radius","Motion"].map((l) => (
          <div key={l} className="flex items-center gap-3">
            <span className="w-20 text-xs text-[#0F2A22]/70">{l}</span>
            <div className="h-1.5 flex-1 rounded-full bg-black/10">
              <div className="h-full w-2/3 rounded-full bg-[#0EA36B]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ResponsiveVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-3">
      {[{w:220,h:280,l:"Desktop"},{w:150,h:220,l:"Tablet"},{w:90,h:180,l:"Mobile"}].map((d,i) => (
        <motion.div key={d.l}
          initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: false }}
          className="floating-card overflow-hidden bg-white p-3"
          style={{ width: d.w, height: d.h }}
        >
          <div className="h-1/3 rounded-lg bg-[#E5F1FF]" />
          <div className="mt-2 h-2 w-2/3 rounded-full bg-[#0B2545]/20" />
          <div className="mt-1 h-2 w-1/2 rounded-full bg-[#0B2545]/10" />
          <div className="mt-3 h-16 rounded-lg bg-[#0B2545]/10" />
          <div className="mt-2 text-center text-[10px] text-[#0B2545]/60">{d.l}</div>
        </motion.div>
      ))}
    </div>
  );
}
function PublishVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0 rgba(217,119,6,0)", "0 0 60px rgba(217,119,6,0.4)", "0 0 0 rgba(217,119,6,0)"] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="rounded-full bg-[#0F1020] px-8 py-4 text-lg font-medium text-white"
      >
        Publish →
      </motion.div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs shadow-soft">
        ✓ Live at yoursite.klin.app
      </div>
    </div>
  );
}

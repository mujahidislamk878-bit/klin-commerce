"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "./MagneticButton";

const tiers = [
  {
    name: "Starter", mo: 0, yr: 0, tag: "For weekend projects",
    features: ["1 project", "klin.app subdomain", "50 templates", "Community support"],
    accent: "#DFF7EE", ink: "#0F2A22",
  },
  {
    name: "Studio", mo: 24, yr: 19, tag: "Most popular", featured: true,
    features: ["10 projects", "Custom domain", "All 300+ templates", "Realtime collaboration", "Priority support"],
    accent: "#E7E4FF", ink: "#1B143A",
  },
  {
    name: "Business", mo: 68, yr: 54, tag: "For growing teams",
    features: ["Unlimited projects", "Team roles", "Custom components", "SSO & audit logs", "Dedicated support"],
    accent: "#FFF7E9", ink: "#2A1F10",
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section className="relative w-full px-0 py-20">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0">
          <div className="w-full rounded-[40px] border border-[#E7E9F2] bg-white shadow-soft">
            <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-7xl">
                  Pricing that gets out
                  <span className="block italic text-[#2563EB]">of the way.</span>
                </h2>
        <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-soft">
          {(["Monthly", "Yearly"] as const).map((l, i) => {
            const active = (i === 1) === yearly;
            return (
              <button
                key={l}
                onClick={() => setYearly(i === 1)}
                className={`relative rounded-full px-5 py-2 text-sm transition ${active ? "text-white" : "text-[#0F1020]/60"}`}
              >
                {active && (
                  <motion.span layoutId="pricing-pill" className="absolute inset-0 rounded-full bg-[#0F1020]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <span className="relative">{l} {i === 1 && <span className="ml-1 text-[10px] opacity-70">−20%</span>}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <motion.div
            key={t.name}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className={`floating-card relative flex flex-col p-8 ${t.featured ? "ring-2 ring-[#0F1020]" : ""}`}
            style={{ background: t.featured ? t.accent : "white" }}
          >
            {t.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0F1020] px-3 py-1 text-[11px] font-medium text-white">
                {t.tag}
              </span>
            )}
            <div className="text-sm text-[#0F1020]/60">{t.name}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-6xl text-[#0F1020]">${yearly ? t.yr : t.mo}</span>
              <span className="text-sm text-[#0F1020]/60">/mo</span>
            </div>
            {!t.featured && <div className="mt-1 text-xs text-[#0F1020]/50">{t.tag}</div>}
            <ul className="mt-6 space-y-3 text-sm text-[#0F1020]/80">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full" style={{ background: t.ink, color: t.accent }}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <MagneticButton variant={t.featured ? "primary" : "ghost"} className="w-full">
                {t.mo === 0 ? "Start free" : "Choose plan"}
              </MagneticButton>
            </div>
          </motion.div>
        ))}
      </div>
                </div>
          </div>
        </div>
      </div>
    </section>
  );
}

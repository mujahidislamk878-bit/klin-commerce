"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puck } from "@measured/puck";
// Puck CSS is loaded via <link> from public/vendor/puck.css (see Hero mount)
// to avoid Lightning CSS trying to resolve Puck's remote @import.
import { puckConfig, templateToPuckData, editableCategories } from "@/lib/puck-config";
import type { Data } from "@measured/puck";

const leftTabs  = ["Pages", "Navigator", "Components", "Templates", "Media", "Theme"];
const rightTabs = ["Typography", "Spacing", "Colors", "Background", "Borders", "Animations", "Responsive", "Visibility", "Advanced"];

export function Playground() {
  const [category, setCategory] = useState(editableCategories[0].id);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [data, setData] = useState<Data>(() => templateToPuckData(editableCategories[0].id));
  const [swapping, setSwapping] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);

  const features = [
    "Klin Editor",
    "Drag, Drop & Edit",
    "Templates Included"
  ];

  // When category changes, animate a fade + swap the underlying Puck data.
  useEffect(() => {
    setSwapping(true);
    const t = setTimeout(() => {
      setData(templateToPuckData(category));
      setSwapping(false);
    }, 240);
    return () => clearTimeout(t);
  }, [category]);

  // Auto-rotate features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const canvasWidth = useMemo(() => {
    switch (device) {
      case "tablet":
        return 760;
      case "mobile":
        return 360;
      default:
        return "100%";
    }
  }, [device]);

  const viewportRatio = useMemo(() => (device === "mobile" ? "9 / 16" : "16 / 10"), [device]);

  return (
    <section className="relative w-full px-0 py-8">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0">
          <div className="w-full rounded-[40px] border border-[#E7E9F2] bg-white shadow-soft">
            <div className="mx-auto max-w-[1400px] px-6 py-10">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6A5AE0]" /> Interactive Playground
                </div>
                <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-7xl">
                  Try the real editor.
                  <span className="block italic text-[#0EA36B]">No sign-up.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#0F1020]/70">
                  Drag, drop, edit text, swap templates. This is Klin — running inline, right on the landing page.
                </p>
              </div>

              {/* category chips */}
              <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
                {editableCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      category === c.id
                        ? "border-transparent bg-[#0F1020] text-white shadow-soft"
                        : "border-black/10 bg-white/80 text-[#0F1020] hover:bg-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* editor shell */}
              <div className="mt-10 floating-card overflow-hidden">
                {/* top toolbar */}
                <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-[#0F1020]/70">
                    <ToolButton>↶ Undo</ToolButton>
                    <ToolButton>↷ Redo</ToolButton>
                    <div className="mx-2 h-4 w-px bg-black/10" />
                    <ToolButton>Preview</ToolButton>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#F6F7FB] p-1">
                    {(["desktop","tablet","mobile"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDevice(d)}
                        className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                          device === d ? "bg-white shadow-soft text-[#0F1020]" : "text-[#0F1020]/60"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <ToolButton>Save</ToolButton>
                    <button className="rounded-full bg-[#0F1020] px-4 py-1.5 text-xs font-medium text-white">Publish</button>
                  </div>
                </div>

                {/* editor container — full width */}
                <div className="bg-[#FAFAFB]">
                  {/* center canvas — real Puck */}
                  <div 
                    className="relative min-h-[500px] overflow-auto bg-[#EEF0F5] p-6 puck-scroll-container"
                    onWheel={(e) => {
                      // Allow wheel scrolling to work normally
                      e.currentTarget.scrollTop += e.deltaY;
                    }}
                  >
                    <style>{`
                      .puck-scroll-container {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                      }
                      .puck-scroll-container::-webkit-scrollbar {
                        width: 0px;
                        height: 0px;
                      }
                      .puck-scroll-container::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .puck-scroll-container::-webkit-scrollbar-thumb {
                        background: transparent;
                      }
                    `}</style>
                    <div className="mx-auto flex w-full max-w-[1080px] items-center justify-center px-2 py-4">
                      <div className="w-full rounded-[30px] border border-[#D9DDE9] bg-[#F2F4F8] p-3 shadow-[0_25px_80px_rgba(15,16,32,0.16)]">
                        <div className="flex items-center gap-2 rounded-[20px] border border-black/5 bg-white/90 px-4 py-3">
                          <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                          </div>
                          <div className="flex-1 rounded-full border border-black/5 bg-[#F5F6FA] px-3 py-1.5 text-center text-[11px] font-medium text-[#0F1020]/60">
                            Klin Editor Preview
                          </div>
                        </div>
                        <div className="mt-3 flex gap-3 rounded-[24px] border border-black/5 bg-[#F7F8FC] p-3">
                          <div className="hidden w-16 rounded-[18px] border border-black/5 bg-[#EFF2F7] md:block" />
                          <div className="flex-1 rounded-[20px] border border-[#E4E8F0] bg-[#EEF0F5] p-3">
                            <div
                              className="mx-auto overflow-hidden rounded-[20px] bg-white shadow-lift transition-all duration-500"
                              style={{ width: canvasWidth, maxWidth: "100%", aspectRatio: viewportRatio }}
                            >
                              <AnimatePresence mode="wait">
                                {!swapping && (
                                  <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.3 }}
                                    className="klin-puck-root"
                                  >
                                    <Puck
                                      config={puckConfig}
                                      data={data}
                                      onChange={(d) => setData(d)}
                                      overrides={{
                                        header: () => <div />,
                                        headerActions: () => <div />,
                                      }}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="hidden w-16 rounded-[18px] border border-black/5 bg-[#EFF2F7] md:block" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-full bg-white/70 px-4 py-2 text-xs text-[#0F1020]/70 shadow-soft"
                  >
                    {features[featureIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex justify-center gap-1.5">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeatureIndex(i)}
                    className={`h-2 rounded-full transition ${
                      i === featureIndex ? "w-6 bg-[#0F1020]" : "w-2 bg-[#0F1020]/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-lg px-2.5 py-1.5 text-xs text-[#0F1020]/70 hover:bg-black/5">
      {children}
    </button>
  );
}

function SidebarTabs({ tabs, compact = false }: { tabs: string[]; compact?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className={`flex flex-wrap gap-1 ${compact ? "text-[10px]" : "text-[11px]"}`}>
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => setActive(i)}
          className={`rounded-md px-2 py-1 ${active === i ? "bg-[#0F1020] text-white" : "text-[#0F1020]/60 hover:bg-black/5"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function Setting({ label, value, swatch }: { label: string; value?: string; swatch?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-soft">
      <span className="text-[#0F1020]/60">{label}</span>
      {swatch ? (
        <span className="h-4 w-6 rounded-md border border-black/10" style={{ background: swatch }} />
      ) : (
        <span className="font-medium text-[#0F1020]">{value}</span>
      )}
    </div>
  );
}

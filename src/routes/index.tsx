import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { CursorGlow } from "@/components/klin/CursorGlow";
import { StatusChips } from "@/components/klin/StatusChips";
import { LenisProvider } from "@/components/klin/LenisProvider";
import { Hero } from "@/components/klin/Hero";
import { TemplateWall } from "@/components/klin/TemplateWall";
import { Storytelling } from "@/components/klin/Storytelling";
import { Marquee } from "@/components/klin/Marquee";
import { Pricing } from "@/components/klin/Pricing";
import { FinalCTA } from "@/components/klin/FinalCTA";

// Puck touches window at module scope — load client-only.
const Playground = lazy(() => import("@/components/klin/Playground").then((m) => ({ default: m.Playground })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klin — Build websites that grow your business" },
      { name: "description", content: "A visual drag-and-drop website builder. Design visually. Customize everything. Publish instantly." },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="relative min-h-screen text-[#0F1020]">
      <FloatingBlobs />
      <GrainOverlay />
      {mounted && (
        <>
          <LenisProvider>
            <main>
              <Hero />
              <TemplateWall />
              <Suspense fallback={<div className="mx-auto max-w-[1500px] px-6 py-24 text-center text-sm text-[#0F1020]/50">Loading editor…</div>}>
                <Playground />
              </Suspense>
              <Storytelling />
              <Marquee />
              <Pricing />
              <FinalCTA />
            </main>
          </LenisProvider>
          <CursorGlow />
          <StatusChips />
        </>
      )}
      {!mounted && (
        <main>
          <Hero />
        </main>
      )}
    </div>
  );
}

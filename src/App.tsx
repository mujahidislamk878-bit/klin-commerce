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
import { AuthPage } from "@/pages/AuthPage";

// Puck touches window at module scope — load client-only.
const Playground = lazy(() => import("@/components/klin/Playground").then((m) => ({ default: m.Playground })));

export function App() {
  const [mounted, setMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (showAuth) {
    return <AuthPage initialMode={authMode} />;
  }

  return (
    <div className="relative min-h-screen text-[#0F1020]">
      <FloatingBlobs />
      <GrainOverlay />
      {mounted ? (
        <>
          <LenisProvider>
            <main>
              <Hero
                onGetStarted={(mode) => {
                  setAuthMode(mode);
                  setShowAuth(true);
                }}
                onWatchVideo={() => setShowVideo(true)}
              />
              <TemplateWall />
              <Suspense
                fallback={
                  <div className="mx-auto max-w-[1500px] px-6 py-24 text-center text-sm text-[#0F1020]/50">
                    Loading editor…
                  </div>
                }
              >
                <Playground />
              </Suspense>
              <Storytelling />
              <Marquee />
              <Pricing />
              <FinalCTA />
              <div className="mx-auto flex max-w-7xl justify-center px-6 pb-20">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuth(true);
                  }}
                  className="rounded-full bg-[#0F1020] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#171A30]"
                >
                  Open auth experience
                </button>
              </div>
            </main>
          </LenisProvider>
          <CursorGlow />
          <StatusChips />
        </>
      ) : (
        <main>
          <Hero
            onGetStarted={(mode) => {
              setAuthMode(mode);
              setShowAuth(true);
            }}
            onWatchVideo={() => setShowVideo(true)}
          />
        </main>
      )}

      {showVideo ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1020]/85 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#0F1020]/95 p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Product tour</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Watch the Klin experience</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
              >
                Close
              </button>
            </div>
            <video
              className="aspect-video w-full rounded-[24px] object-cover"
              src="/assets/hero-bg.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

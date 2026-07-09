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
import { AuthCallback } from "@/pages/AuthCallback";
import { OnboardingWizard } from "@/pages/OnboardingWizard";
import { SetupScreen } from "@/pages/SetupScreen";
import { Dashboard } from "@/pages/Dashboard";
import { sessionManager, type UserSession } from "@/lib/session";

// Puck touches window at module scope — load client-only.
const Playground = lazy(() => import("@/components/klin/Playground").then((m) => ({ default: m.Playground })));

export function App() {
  const [mounted, setMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showVideo, setShowVideo] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthCallback, setShowAuthCallback] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current route
    const path = window.location.pathname;
    if (path === "/auth/callback") {
      setShowAuthCallback(true);
      setLoading(false);
      return;
    }

    // Check for existing session on mount
    const existingSession = sessionManager.getSession();
    if (existingSession) {
      setUserSession(existingSession);
      setShowDashboard(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-2 border-[#0F1020]/30 border-t-[#0F1020] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Show auth callback handler
  if (showAuthCallback) {
    return <AuthCallback />;
  }

  // Handle auth completion -> show onboarding and save session
  const handleAuthComplete = (email?: string) => {
    // Create session after auth
    const newSession: UserSession = {
      userId: `user_${Date.now()}`,
      email: email || "user@example.com",
      token: `token_${Date.now()}`,
      createdAt: Date.now(),
    };
    sessionManager.saveSession(newSession);
    setUserSession(newSession);

    setShowAuth(false);
    setShowOnboarding(true);
  };

  // Handle onboarding completion -> show setup
  const handleOnboardingComplete = (data?: Record<string, string>) => {
    // Update session with onboarding data
    if (userSession && data) {
      const updatedSession: UserSession = {
        ...userSession,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      sessionManager.saveSession(updatedSession);
      setUserSession(updatedSession);
    }

    setShowOnboarding(false);
    setShowSetup(true);
  };

  // Handle setup completion -> show dashboard
  const handleSetupComplete = () => {
    setShowSetup(false);
    setShowDashboard(true);
  };

  // Handle dashboard logout -> back to landing and clear session
  const handleLogout = () => {
    sessionManager.clearSession();
    setUserSession(null);
    setShowDashboard(false);
    setShowAuth(false);
    setShowOnboarding(false);
    setShowSetup(false);
  };

  // Show onboarding wizard
  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // Show setup screen
  if (showSetup) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  // Show dashboard
  if (showDashboard) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Show auth page (modified to call handler on complete)
  if (showAuth) {
    return (
      <AuthPage
        initialMode={authMode}
        onAuthComplete={handleAuthComplete}
      />
    );
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
                isAuthenticated={!!userSession}
                onGetStarted={(mode) => {
                  setAuthMode(mode);
                  setShowAuth(true);
                }}
                onContinueToDashboard={() => {
                  setShowDashboard(true);
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
            isAuthenticated={!!userSession}
            onGetStarted={(mode) => {
              setAuthMode(mode);
              setShowAuth(true);
            }}
            onContinueToDashboard={() => {
              setShowDashboard(true);
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

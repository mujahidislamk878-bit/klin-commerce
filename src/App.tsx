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
import { WebsiteDashboard } from "@/pages/WebsiteDashboard";
import { PlaygroundPage } from "@/pages/PlaygroundPage";
import { LogoutPage } from "@/pages/LogoutPage";
import { sessionManager, type UserSession } from "@/lib/session";

// Puck touches window at module scope — load client-only.
const Playground = lazy(() => import("@/components/klin/Playground").then((m) => ({ default: m.Playground })));

export function App() {
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showVideo, setShowVideo] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Validate session on mount
    const validateSession = async () => {
      const existingSession = sessionManager.getSession();
      if (existingSession) {
        setUserSession(existingSession);
        
        // Verify token with backend to get fresh onboarding status
        try {
          const res = await fetch("http://localhost:5000/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: existingSession.token }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              const updatedSession = {
                ...existingSession,
                onboarding: !!data.user.onboarding,
              };
              sessionManager.saveSession(updatedSession);
              setUserSession(updatedSession);
            }
          } else {
            // Token invalid or expired
            sessionManager.clearSession();
            setUserSession(null);
          }
        } catch (e) {
          console.error("Token verification failed, relying on local session", e);
        }
      }
      setLoading(false);
      setMounted(true);
    };

    if (window.location.pathname === "/auth/callback") {
      setLoading(false);
      setMounted(true);
    } else {
      validateSession();
    }
  }, []);

  // Route protection and redirection
  useEffect(() => {
    if (loading || !mounted || currentPath === "/auth/callback" || currentPath === "/logout") return;

    if (!userSession) {
      // Guest users
      if (currentPath !== "/" && currentPath !== "/auth") {
        navigateTo("/auth");
      }
    } else {
      // Authenticated users
      const hasCompletedOnboarding = !!userSession.onboarding;

      if (!hasCompletedOnboarding) {
        if (currentPath !== "/onboarding" && currentPath !== "/setup") {
          navigateTo("/onboarding");
        }
      } else {
        if (currentPath === "/" || currentPath === "/auth" || currentPath === "/onboarding") {
          navigateTo("/dashboard/home");
        }
      }
    }
  }, [currentPath, userSession, loading, mounted]);

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
  if (currentPath === "/auth/callback") {
    return <AuthCallback />;
  }

  // Handle auth completion -> show onboarding and save session
  const handleAuthComplete = (email?: string) => {
    const newSession: UserSession = {
      userId: `user_${Date.now()}`,
      email: email || "user@example.com",
      token: `token_${Date.now()}`,
      onboarding: false,
      createdAt: Date.now(),
    };
    sessionManager.saveSession(newSession);
    setUserSession(newSession);
    navigateTo("/onboarding");
  };

  // Handle onboarding completion -> show setup
  const handleOnboardingComplete = async (data?: Record<string, string>) => {
    if (userSession) {
      const updatedSession: UserSession = {
        ...userSession,
        onboarding: true,
      };
      if (data) {
        updatedSession.firstName = data.firstName;
        updatedSession.lastName = data.lastName;
      }
      sessionManager.saveSession(updatedSession);
      setUserSession(updatedSession);

      // Save onboarding data to DB
      try {
        await fetch("http://localhost:5000/api/user/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userSession.token}`,
          },
          body: JSON.stringify({ 
            token: userSession.token,
            ...data
          }),
        });
      } catch (err) {
        console.error("Failed to persist onboarding state in DB:", err);
      }
    }
    navigateTo("/setup");
  };

  // Handle setup completion -> show dashboard
  const handleSetupComplete = () => {
    navigateTo("/dashboard/home");
  };

  // Handle dashboard logout -> go to logout screen
  const handleLogout = () => {
    navigateTo("/logout");
  };

  const handleLogoutComplete = () => {
    sessionManager.clearSession();
    setUserSession(null);
    navigateTo("/");
  };

  // Route rendering
  if (currentPath === "/auth") {
    return (
      <AuthPage
        initialMode={authMode}
        onAuthComplete={handleAuthComplete}
      />
    );
  }

  if (currentPath === "/onboarding") {
    if (!userSession) {
      return (
        <AuthPage
          initialMode="login"
          onAuthComplete={handleAuthComplete}
        />
      );
    }
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (currentPath === "/setup") {
    if (!userSession) {
      return (
        <AuthPage
          initialMode="login"
          onAuthComplete={handleAuthComplete}
        />
      );
    }
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (currentPath === "/logout") {
    return <LogoutPage onLogoutComplete={handleLogoutComplete} />;
  }

  if (currentPath.startsWith("/playground")) {
    if (!userSession) {
      return (
        <AuthPage
          initialMode="login"
          onAuthComplete={handleAuthComplete}
        />
      );
    }
    return <PlaygroundPage />;
  }

  if (currentPath.startsWith("/dashboard/websites/")) {
    if (!userSession) {
      return (
        <AuthPage
          initialMode="login"
          onAuthComplete={handleAuthComplete}
        />
      );
    }
    const websiteId = currentPath.split("/")[3];
    return <WebsiteDashboard websiteId={websiteId} user={userSession} onNavigate={navigateTo} />;
  }

  if (currentPath.startsWith("/dashboard")) {
    if (!userSession) {
      return (
        <AuthPage
          initialMode="login"
          onAuthComplete={handleAuthComplete}
        />
      );
    }
    const tab = currentPath.split("/")[2] || "home";
    return <Dashboard onLogout={handleLogout} activeTab={tab} onNavigate={navigateTo} user={userSession} />;
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
                  navigateTo("/auth");
                }}
                onContinueToDashboard={() => {
                  navigateTo("/dashboard/home");
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
                    navigateTo("/auth");
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
              navigateTo("/auth");
            }}
            onContinueToDashboard={() => {
              navigateTo("/dashboard/home");
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

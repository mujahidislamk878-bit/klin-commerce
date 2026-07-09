"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sessionManager } from "@/lib/session";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { Sparkles, Check, AlertCircle } from "lucide-react";

export function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Google auth error: ${error}`);
          console.error("OAuth error:", error);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received from Google");
          return;
        }

        setMessage("Exchanging authorization code...");

        // Call backend to exchange code for tokens and save user
        const redirectUri = `${window.location.origin}/auth/callback`;
        const response = await fetch("http://localhost:5000/api/auth/google-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirectUri }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Backend error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Authentication failed");
        }

        console.log("✓ User authenticated:", data.user.email);

        // Save session to localStorage
        sessionManager.saveSession({
          userId: data.user.userId,
          email: data.user.email,
          firstName: data.user.name.split(" ")[0] || "User",
          lastName: data.user.name.split(" ").slice(1).join(" ") || "",
          onboarding: !!data.user.onboarding,
          token: data.token,
          createdAt: Date.now(),
        });

        setStatus("success");
        setMessage("Successfully authenticated!");

        // Redirect to home after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Auth callback error:", errorMsg);
        setStatus("error");
        setMessage(`Error: ${errorMsg}`);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center relative overflow-hidden">
      <FloatingBlobs />
      <GrainOverlay />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="rounded-[32px] border border-black/5 bg-white shadow-[0_20px_80px_-20px_rgba(15,16,32,0.15)] p-8 md:p-10 text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-lg">K</span>
            </div>
            <span className="font-semibold text-[#0F1020] text-xl tracking-wide">Klin</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            {status === "loading" && (
              <>
                <div className="relative w-16 h-16 mb-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500"
                  />
                  <div className="absolute inset-2 rounded-full border border-black/5 bg-[#FAFBFC]" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#0F1020]">{message}</h3>
                <p className="text-sm text-[#0F1020]/60">Validating credentials with Google...</p>
              </>
            )}

            {status === "success" && (
              <div className="space-y-4 py-4 w-full">
                <h3 className="text-2xl font-bold tracking-tight text-[#0F1020]">Welcome to Klin</h3>
                <div className="pt-6">
                  <div className="relative w-10 h-10 mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0F1020] border-r-[#0F1020]"
                    />
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-2"
                >
                  <AlertCircle className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-bold tracking-tight text-[#0F1020]">Sign In Failed</h3>
                <p className="text-sm text-red-500/80 px-4">{message}</p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="mt-6 w-full h-11 rounded-lg bg-[#0F1020] hover:bg-[#171A30] text-white text-sm font-semibold transition"
                >
                  Return to Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

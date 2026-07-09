"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sessionManager } from "@/lib/session";

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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-[#0F1020]/30 border-t-[#0F1020] rounded-full"
              />
            </div>
            <p className="text-[#0F1020] text-lg">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl">✓</div>
            <p className="text-[#0F1020] text-lg">{message}</p>
            <p className="text-[#0F1020]/60 text-sm">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl">✕</div>
            <p className="text-[#0F1020] text-lg">{message}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 px-6 py-2 bg-[#0F1020] text-white rounded-lg font-semibold hover:bg-[#171A30] transition"
            >
              Go Back
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

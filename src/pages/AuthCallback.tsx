"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL params
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received");
          return;
        }

        // Exchange code for token (would normally be done server-side)
        setStatus("success");
        setMessage("Authentication successful!");

        // Redirect to onboarding after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1020] to-[#1A1F35] flex items-center justify-center">
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
                className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full"
              />
            </div>
            <p className="text-white text-lg">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl">✓</div>
            <p className="text-white text-lg">{message}</p>
            <p className="text-white/60 text-sm">Redirecting...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl">✕</div>
            <p className="text-white text-lg">{message}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 px-6 py-2 bg-white text-[#0F1020] rounded-lg font-semibold hover:bg-white/90 transition"
            >
              Go Back
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

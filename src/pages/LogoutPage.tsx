"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

type LogoutPageProps = {
  onLogoutComplete: () => void;
};

export function LogoutPage({ onLogoutComplete }: LogoutPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLogoutComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onLogoutComplete]);

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
            <div className="relative w-16 h-16 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-300"
              />
              <div className="absolute inset-2 rounded-full border border-black/5 bg-[#FAFBFC]" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#0F1020]">Logging out</h3>
            <p className="text-sm text-[#0F1020]/60">Securing your session data...</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

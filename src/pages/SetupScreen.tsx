"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

type SetupStep = {
  text: string;
  duration: number;
};

const setupSteps: SetupStep[] = [
  { text: "Setting up your playground...", duration: 2 },
  { text: "Setting up your building tools...", duration: 2 },
  { text: "Launching your design workspace...", duration: 2 },
];

type SetupScreenProps = {
  onComplete?: () => void;
};

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let elapsed = 0;

    setupSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index + 1);
        elapsed += step.duration * 1000;

        if (index === setupSteps.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onComplete?.(), 1500);
          }, step.duration * 1000);
        }
      }, elapsed);

      return () => clearTimeout(timeout);
    });
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center overflow-hidden relative">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-black/5 shadow-[0_20px_80px_-20px_rgba(15,16,32,0.15)] rounded-[32px] p-8 md:p-10 relative z-10 mx-4 space-y-6"
      >
        {/* Klin Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-lg">K</span>
          </div>
          <span className="font-semibold text-[#0F1020] text-xl tracking-wide">Klin</span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F1020]">Setting up Klin</h2>
          <p className="text-sm text-[#0F1020]/50 mt-1">Configuring your local workspace environment</p>
        </div>

        {/* Steps Stack */}
        <div className="space-y-4 py-4">
          {setupSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isFinished = index < currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFBFC] border border-[#0F1020]/5"
              >
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-[#0F1020]" : isFinished ? "text-[#0F1020]/55" : "text-[#0F1020]/30"
                  }`}
                >
                  {step.text}
                </span>

                {/* Status Indicator / Animation (No emojis, no tick, simple animations) */}
                <div className="flex items-center justify-center w-6 h-6">
                  {isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"
                    />
                  ) : isFinished ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#0F1020]/10" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center pt-2"
          >
            <p className="text-xs text-[#0F1020]/40 font-semibold uppercase tracking-wider animate-pulse">
              Workspace configured successfully. Redirecting...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

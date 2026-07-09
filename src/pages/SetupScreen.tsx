"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Palette } from "lucide-react";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

type SetupStep = {
  icon: React.ReactNode;
  text: string;
  duration: number;
};

const setupSteps: SetupStep[] = [
  { icon: <Palette className="h-6 w-6" />, text: "Setting up your playground...", duration: 2 },
  { icon: <Zap className="h-6 w-6" />, text: "Setting up your building tools...", duration: 2 },
  {
    icon: <Sparkles className="h-6 w-6" />,
    text: "Launching your design workspace...",
    duration: 2,
  },
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

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md w-full px-6"
      >
        {/* Main loading indicator */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Middle pulsing ring */}
            <motion.div
              className="absolute inset-3 rounded-full border border-black/5 bg-white/40 backdrop-blur-sm"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-extrabold text-xs">K</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold tracking-tight text-[#0F1020] mb-8"
        >
          Setting up Klin
        </motion.h1>

        {/* Steps */}
        <div className="space-y-4 h-16 flex items-center justify-center relative">
          {setupSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: index === currentStep ? 1 : index < currentStep ? 0.3 : 0,
                y: index === currentStep ? 0 : index < currentStep ? -10 : 10,
              }}
              transition={{ duration: 0.4 }}
              className="absolute flex items-center justify-center gap-3 text-[#0F1020]"
            >
              <motion.div
                animate={index === currentStep ? { rotate: 360 } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="text-blue-500"
              >
                {step.icon}
              </motion.div>
              <span className="font-semibold text-sm tracking-wide">{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Completion message */}
         {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-8 bg-white/80 border border-black/5 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-emerald-500 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-bold text-[#0F1020]">Ready for takeoff!</h2>
            <p className="text-[#0F1020]/60 text-xs mt-1">Redirecting to your dashboard console...</p>
          </motion.div>
        )}

        {/* Progress bar at bottom */}
        <div className="mt-12 h-1.5 bg-[#0F1020]/5 rounded-full overflow-hidden w-48 mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            animate={{ width: `${((currentStep + 1) / (setupSteps.length + 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

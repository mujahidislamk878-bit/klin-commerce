"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Rocket, Palette } from "lucide-react";

type SetupStep = {
  icon: React.ReactNode;
  text: string;
  duration: number;
};

const setupSteps: SetupStep[] = [
  { icon: <Palette className="h-6 w-6" />, text: "Designing your canvas...", duration: 2 },
  { icon: <Zap className="h-6 w-6" />, text: "Powering up Klin magic", duration: 2 },
  {
    icon: <Sparkles className="h-6 w-6" />,
    text: "Sprinkling some fairy dust",
    duration: 2,
  },
  { icon: <Rocket className="h-6 w-6" />, text: "Preparing for takeoff", duration: 2 },
];

type SetupScreenProps = {
  onComplete?: () => void;
};

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const totalDuration = setupSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    setupSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index + 1);
        elapsed += step.duration * 1000;

        if (index === setupSteps.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 1500);
          }, step.duration * 1000);
        }
      }, elapsed);

      return () => clearTimeout(timeout);
    });
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#0F1020]/5 blur-3xl"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
            initial={{
              left: `${20 + i * 20}%`,
              top: `${-20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* Main loading indicator */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0F1020] border-r-[#0F1020]"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Middle pulsing ring */}
            <motion.div
              className="absolute inset-3 rounded-full border border-[#0F1020]/30"
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
                <div className="w-8 h-8 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/50 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
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
          className="text-4xl font-display text-[#0F1020] mb-8"
        >
          Setting up Klin
        </motion.h1>

        {/* Steps */}
        <div className="space-y-4 h-12">
          {setupSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index === currentStep ? 1 : index < currentStep ? 0.4 : 0,
                x: index === currentStep ? 0 : -20,
              }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 text-lg text-[#0F1020]"
            >
              <motion.div
                animate={index === currentStep ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-[#0F1020]"
              >
                {step.icon}
              </motion.div>
              <span className="font-medium">{step.text}</span>
              {index < currentStep && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-2 text-green-600">
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Completion message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-display text-[#0F1020]">Ready to create!</h2>
            <p className="text-[#0F1020]/60 mt-2">Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {/* Progress bar at bottom */}
        <motion.div className="absolute bottom-8 left-8 right-8 h-1.5 bg-[#0F1020]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0F1020] to-[#0F1020]/50"
            animate={{ width: `${((currentStep + 1) / (setupSteps.length + 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

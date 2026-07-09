"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "email" | "select";
    placeholder: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }[];
};

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Klin",
    description: "Let's set up your account with a few quick details",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Your first name",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Your last name",
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: "Tell us about your business",
    description: "Help us understand what you build",
    fields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "Your company or business name",
        required: true,
      },
      {
        name: "businessType",
        label: "Business Type",
        type: "select",
        placeholder: "Select your industry",
        options: [
          { value: "agency", label: "Design Agency" },
          { value: "startup", label: "Startup" },
          { value: "ecommerce", label: "E-Commerce" },
          { value: "saas", label: "SaaS" },
          { value: "portfolio", label: "Portfolio/Creator" },
          { value: "enterprise", label: "Enterprise" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
    ],
  },
  {
    id: 3,
    title: "Your preferences",
    description: "Customize your Klin experience",
    fields: [
      {
        name: "occupations",
        label: "Occupation",
        type: "select",
        placeholder: "Choose your occupation",
        options: [
          { value: "designer", label: "UX/UI Designer" },
          { value: "developer", label: "Software Engineer / Developer" },
          { value: "pm", label: "Product Manager" },
          { value: "founder", label: "Founder / Entrepreneur" },
          { value: "marketer", label: "Marketer / Growth Hacker" },
          { value: "creator", label: "Content Creator" },
          { value: "other", label: "Other" },
        ],
        required: true,
      },
      {
        name: "teamSize",
        label: "Team Size",
        type: "select",
        placeholder: "How many people in your team?",
        options: [
          { value: "solo", label: "Just me" },
          { value: "small", label: "2-5 people" },
          { value: "medium", label: "6-20 people" },
          { value: "large", label: "20+ people" },
        ],
        required: true,
      },
    ],
  },
];

type OnboardingData = {
  [key: string]: string;
};

type OnboardingWizardProps = {
  onComplete?: (data: OnboardingData) => void;
};

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({});
  const [direction, setDirection] = useState(0);

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isStepValid = step.fields.every(
    (field) => !field.required || formData[field.name]
  );

  const cardVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      rotateY: dir < 0 ? 90 : -90,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden relative">
      <FloatingBlobs />
      <GrainOverlay />

      <div className="w-full max-w-xl relative z-10">
        {/* Klin Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="h-10 w-10 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-lg">K</span>
          </div>
          <span className="font-semibold text-[#0F1020] text-xl tracking-wide">Klin</span>
        </motion.div>

        {/* 3D Flipping Card Container */}
        <div style={{ perspective: 2000 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: "spring", stiffness: 100, damping: 15 },
                opacity: { duration: 0.3 }
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_80px_-20px_rgba(15,16,32,0.15)] p-8 md:p-10 flex flex-col justify-between min-h-[450px]"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase tracking-wider">
                    <Wand2 className="h-3.5 w-3.5" />
                    Workspace Setup Step {currentStep + 1} of {steps.length}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0F1020]">{step.title}</h2>
                  <p className="text-sm text-[#0F1020]/60">{step.description}</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {step.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm text-[#0F1020]/70 font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          className="w-full h-11 px-4 rounded-lg bg-[#FAFBFC] border border-[#0F1020]/10 text-[#0F1020] focus:outline-none focus:border-[#0F1020]/20 focus:ring-2 focus:ring-[#0F1020]/5 transition text-sm cursor-pointer"
                        >
                          <option value="" className="bg-white text-[#0F1020]/40">{field.placeholder}</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white text-[#0F1020]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          className="h-11 rounded-lg border border-[#0F1020]/10 bg-[#FAFBFC] text-sm text-[#0F1020] placeholder:text-[#0F1020]/30 focus:outline-none focus:border-[#0F1020]/20 transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-4 border-t border-[#0F1020]/5 pt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F1020]/5 text-[#0F1020]/60 border border-[#0F1020]/10 hover:bg-[#0F1020]/10 hover:text-[#0F1020] disabled:opacity-30 disabled:cursor-not-allowed transition duration-300 text-xs font-semibold"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid}
                  className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0F1020] hover:bg-[#171A30] disabled:opacity-50 text-white font-bold transition duration-300 text-xs shadow-lg"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete Setup
                      <Sparkles className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

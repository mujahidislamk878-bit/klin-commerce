"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "email" | "url" | "select";
    placeholder: string;
    options?: { value: string; label: string }[];
    required?: boolean;
  }[];
};

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Klin! 🚀",
    description: "Let's set up your account with a few quick details",
    fields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "Your company or business name",
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: "Tell us about your business",
    description: "Help us understand what you do",
    fields: [
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
    title: "Your website details",
    description: "Configure your Klin workspace",
    fields: [
      {
        name: "websiteUrl",
        label: "Website URL",
        type: "url",
        placeholder: "yourdomain.com",
        required: true,
      },
      {
        name: "websiteDescription",
        label: "Website Description",
        type: "text",
        placeholder: "Brief description of your website",
        required: false,
      },
    ],
  },
  {
    id: 4,
    title: "Almost done! 🎉",
    description: "One final step - your preferences",
    fields: [
      {
        name: "templatePreference",
        label: "Preferred Template Style",
        type: "select",
        placeholder: "Choose a starting template",
        options: [
          { value: "minimal", label: "Minimal & Clean" },
          { value: "bold", label: "Bold & Modern" },
          { value: "creative", label: "Creative & Playful" },
          { value: "corporate", label: "Corporate & Professional" },
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

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1020] via-[#1A1F35] to-[#0F1020] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="h-1 flex-1 rounded-full bg-white/10"
                animate={{
                  backgroundColor:
                    index <= currentStep ? "#FFFFFF" : "rgba(255, 255, 255, 0.1)",
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-white/60">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Form content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="space-y-8"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h2 className="text-4xl font-display text-white">{step.title}</h2>
              <p className="text-lg text-white/60">{step.description}</p>
            </motion.div>

            {/* Form fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {step.fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-white">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
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
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex gap-4"
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid}
            className="ml-auto flex items-center gap-2 px-8 py-3 rounded-lg bg-white text-[#0F1020] font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Step indicator */}
        <div className="mt-8 text-center text-sm text-white/40">
          {currentStep + 1} / {steps.length}
        </div>
      </div>
    </div>
  );
}

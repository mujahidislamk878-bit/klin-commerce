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
    type: "text" | "email" | "url" | "tel" | "select";
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
    title: "Website & Contact",
    description: "Configure your Klin workspace",
    fields: [
      {
        name: "companyUrl",
        label: "Company Website",
        type: "url",
        placeholder: "https://example.com",
        required: false,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 (555) 000-0000",
        required: false,
      },
    ],
  },
  {
    id: 4,
    title: "Your preferences",
    description: "Customize your Klin experience",
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

  const flipVariants = {
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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Klin logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-10 w-10 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-xl flex items-center justify-center">
            <span className="text-white font-display text-lg">K</span>
          </div>
          <span className="font-semibold text-[#0F1020]">Klin</span>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="h-1.5 flex-1 rounded-full bg-[#0F1020]/10"
                animate={{
                  backgroundColor:
                    index <= currentStep ? "#0F1020" : "rgba(15, 16, 32, 0.1)",
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-[#0F1020]/60">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Card container */}
        <motion.div
          layout
          className="rounded-2xl border border-[#0F1020]/10 bg-white shadow-lg p-8 md:p-12"
          style={{ perspective: 1000 }}
        >
          {/* Form content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
              }}
              className="space-y-8"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-display text-[#0F1020]">{step.title}</h2>
                <p className="text-base text-[#0F1020]/60">{step.description}</p>
              </motion.div>

              {/* Form fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
              >
                {step.fields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                  >
                    <label className="block text-sm font-semibold text-[#0F1020] mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white border border-[#0F1020]/20 text-[#0F1020] placeholder:text-[#0F1020]/40 focus:outline-none focus:border-[#0F1020]/50 focus:ring-2 focus:ring-[#0F1020]/10 transition"
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
                        className="w-full px-4 py-3 rounded-lg bg-white border border-[#0F1020]/20 text-[#0F1020] placeholder:text-[#0F1020]/40 focus:outline-none focus:border-[#0F1020]/50 focus:ring-2 focus:ring-[#0F1020]/10 transition"
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
            className="mt-10 flex gap-4"
          >
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F1020]/10 text-[#0F1020] border border-[#0F1020]/20 hover:bg-[#0F1020]/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid}
              className="ml-auto flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0F1020] text-white font-semibold hover:bg-[#0F1020]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#0F1020]/60">
          {currentStep + 1} / {steps.length}
        </div>
      </div>
    </div>
  );
}

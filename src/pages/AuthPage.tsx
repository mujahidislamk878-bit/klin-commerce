import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { authConfig, initiateGoogleAuth, submitEmailAuth } from "@/lib/auth";

const testimonials = [
  {
    site: "flora botanicals",
    descriptor: "Transformed their vision into reality using Klin's powerful tools",
    color: "#E7E4FF",
    image: "/assets/flora_botanicals.png",
  },
  {
    site: "larder Co.",
    descriptor: "Launched 12+ stunning projects with Klin's seamless workflow",
    color: "#DFF7EE",
    image: "/assets/larder_co.png",
  },
  {
    site: "studio nord",
    descriptor: "Building the future faster with Klin's next-generation platform",
    color: "#E5F1FF",
    image: "/assets/studio_nord.png",
  },
];

export function AuthPage({ initialMode = "login", onAuthComplete }: { initialMode?: "login" | "signup"; onAuthComplete?: (email?: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);

    try {
      const response = await submitEmailAuth({
        mode: "login",
        email,
        password,
      });

      if (response.ok) {
        setFeedback(`${response.provider} auth initiated`);
        setEmail("");
        setPassword("");
        // Call onAuthComplete after a short delay with email
        setTimeout(() => {
          onAuthComplete?.(email);
        }, 500);
      } else {
        setFeedback(response.message || "Authentication failed");
      }
    } catch (error) {
      setFeedback("An error occurred during authentication");
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = () => {
    initiateGoogleAuth("login");
    // Call onAuthComplete for Google flow
    setTimeout(() => {
      onAuthComplete?.();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_80px_-20px_rgba(15,16,32,0.2)]"
      >
        <motion.div
          className="flex flex-col gap-0 lg:flex-row lg:gap-0 lg:items-stretch"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0,
              },
            },
            hidden: {},
          }}
        >
          {/* SECTION 1 - Testimonials */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
            }}
            className="flex flex-col gap-6 bg-gradient-to-b from-white to-[#FAFBFC] p-8 sm:p-10 lg:w-1/2 lg:justify-between"
          >
            {/* Testimonial Images */}
            <div className="overflow-hidden rounded-[20px] border border-black/5 shadow-md">
              <motion.img
                key={`img-${testimonialIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={testimonials[testimonialIndex].image}
                alt={testimonials[testimonialIndex].site}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="h-7 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`site-${testimonialIndex}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-xl font-semibold tracking-tight leading-none">
                      {testimonials[testimonialIndex].site}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${testimonialIndex}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="text-sm text-[#0F1020]/60 leading-none"
                  >
                    {testimonials[testimonialIndex].descriptor}
                  </motion.p>
                </AnimatePresence>
              </div>

              <p className="text-xs text-[#0F1020]/40 mt-1">Founded with Klin</p>
            </div>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1.5 rounded-full bg-[#0F1020]/20"
                  animate={{
                    width: index === testimonialIndex ? 24 : 6,
                    backgroundColor: index === testimonialIndex ? "#0F1020" : "#0F102033",
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
          </motion.div>

          {/* SECTION 2 - Login Form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 100 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
            }}
            className="flex flex-col gap-8 p-8 sm:p-10 lg:w-1/2"
          >
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-base text-[#0F1020]/60">Enter your credentials to continue</p>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#0F1020]/10 bg-white transition hover:bg-[#F9FAFB]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.6 12.23c0-.64-.06-1.25-.18-1.84H12v3.48h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.16Z" />
                <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
                <path fill="#FBBC05" d="M6.4 13.91A6.02 6.02 0 0 1 6.4 10.09V7.51H3.07a10 10 0 0 0 0 12.8l3.33-2.4Z" />
                <path fill="#EA4335" d="M12 6.04c1.47 0 2.78.5 3.82 1.49l2.86-2.86A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.33 2.58c.8-2.36 3-4.12 5.6-4.12Z" />
              </svg>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-[#0F1020]/40">
              <div className="h-px flex-1 bg-[#0F1020]/10" />
              <span>or</span>
              <div className="h-px flex-1 bg-[#0F1020]/10" />
            </div>

            <form className="space-y-3" onSubmit={handleEmailSubmit}>
              <label className="block space-y-2 text-sm">
                <span className="text-[#0F1020]/70 font-medium">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1020]/30" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-lg border border-[#0F1020]/10 bg-[#FAFBFC] pl-10 text-sm"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-[#0F1020]/70 font-medium">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F1020]/30" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 rounded-lg border border-[#0F1020]/10 bg-[#FAFBFC] pl-10 pr-10 text-sm"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F1020]/40 transition hover:text-[#0F1020]/70"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0F1020] text-sm font-semibold text-white transition hover:bg-[#171A30] disabled:opacity-50"
              >
                {busy ? "Working..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-[#0F1020]/10 bg-[#F9FAFB] px-4 py-3 text-xs text-[#0F1020]/70"
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

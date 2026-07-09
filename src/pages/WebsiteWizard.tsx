import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Check, Globe, Sliders, Palette, Shield } from "lucide-react";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { Input } from "@/components/ui/input";

interface WebsiteWizardProps {
  templateId: string;
  templateName: string;
  token: string;
  onComplete: (websiteId: string) => void;
  onCancel: () => void;
}

export function WebsiteWizard({ templateId, templateName, token, onComplete, onCancel }: WebsiteWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [industry, setIndustry] = useState("Fashion");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [themeStyle, setThemeStyle] = useState("modern");
  const [primaryColor, setPrimaryColor] = useState("#0F1020");
  const [logo, setLogo] = useState("");

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/websites/wizard-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId,
          businessName,
          websiteName,
          subdomain,
          industry,
          currency,
          language,
          timezone,
          themeStyle,
          primaryColor,
          logo,
        }),
      });

      const result = await res.json();
      if (result.success && result.website) {
        onComplete(result.website.websiteId);
      } else {
        alert("Creation failed: " + (result.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create website");
    } finally {
      setLoading(false);
    }
  };

  const stepsCount = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex flex-col relative overflow-hidden font-sans">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-black/5 bg-white/70 backdrop-blur-md relative z-10">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-[#0F1020]/60 hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </button>
        <span className="text-xs font-mono font-bold text-[#0F1020]/40">
          Cloning: <span className="text-[#0f172a]">{templateName}</span>
        </span>
      </header>

      {/* Wizard Progress */}
      <div className="max-w-xl w-full mx-auto mt-12 px-6 relative z-10 flex-1 flex flex-col justify-between pb-24">
        <div className="space-y-8">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-[#0F1020]/50">Setup Wizard</span>
            <span>Step {step} of {stepsCount}</span>
          </div>

          <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#0F1020]" 
              animate={{ width: `${(step / stepsCount) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" /> Site Identity
                  </h2>
                  <p className="text-xs text-[#0F1020]/50">Provide branding metadata to hydrate the template canvas.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Business Legal Name</label>
                    <Input
                      type="text"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value);
                        if (!websiteName) setWebsiteName(`${e.target.value} Store`);
                        if (!subdomain) setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                      }}
                      placeholder="e.g. Apex Attires"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Website Visual Name</label>
                    <Input
                      type="text"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g. Apex Attires Official"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Preferred Subdomain</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                        placeholder="apex-attires"
                        className="text-xs font-mono text-blue-600 flex-1"
                      />
                      <span className="py-2 text-xs font-mono font-bold text-[#0F1020]/50">.klin.store</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Industry Segment</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full text-xs bg-[#FAFBFC] border border-black/10 rounded-xl p-3"
                    >
                      <option value="Fashion">Fashion & Apparel</option>
                      <option value="SaaS">SaaS & Software</option>
                      <option value="Electronics">Electronics & Tech</option>
                      <option value="Design">Creative Portfolio</option>
                      <option value="Agency">Marketing & Media</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" /> Localization
                  </h2>
                  <p className="text-xs text-[#0F1020]/50">Set up language and local currency preferences.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Store Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full text-xs bg-[#FAFBFC] border border-black/10 rounded-xl p-3"
                    >
                      <option value="USD">USD ($) — United States Dollar</option>
                      <option value="EUR">EUR (€) — Euro</option>
                      <option value="GBP">GBP (£) — Great British Pound</option>
                      <option value="CAD">CAD ($) — Canadian Dollar</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Primary Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full text-xs bg-[#FAFBFC] border border-black/10 rounded-xl p-3"
                    >
                      <option value="en">English (US/UK)</option>
                      <option value="es">Español (Spanish)</option>
                      <option value="fr">Français (French)</option>
                      <option value="de">Deutsch (German)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Default Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full text-xs bg-[#FAFBFC] border border-black/10 rounded-xl p-3"
                    >
                      <option value="UTC">UTC / Greenwich Mean Time</option>
                      <option value="EST">EST / Eastern Standard Time (New York)</option>
                      <option value="PST">PST / Pacific Standard Time (Los Angeles)</option>
                      <option value="IST">IST / Indian Standard Time (Delhi)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-indigo-500" /> Branding Style
                  </h2>
                  <p className="text-xs text-[#0F1020]/50">Choose a default styling style and upload assets.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Theme Design Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: "modern", label: "Modern Sleek" },
                        { id: "minimal", label: "Minimalist Light" },
                        { id: "glass", label: "Glassmorphic" },
                      ]).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setThemeStyle(st.id)}
                          className={`p-3 border rounded-xl text-xs transition-all font-semibold ${
                            themeStyle === st.id
                              ? "border-[#0F1020] bg-black/5 text-[#0F1020] shadow-sm"
                              : "border-black/5 text-[#0F1020]/60 hover:border-black/10"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Primary Brand Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 border border-black/10 rounded-xl cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-[#0F1020]/60 uppercase">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#0F1020]/75">Branding Logo Link (Optional)</label>
                    <Input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-8 border-t border-black/5 mt-10">
          {step > 1 && (
            <button
              onClick={handlePrev}
              disabled={loading}
              className="flex-1 py-3 bg-black/5 hover:bg-black/10 text-xs font-bold rounded-xl transition"
            >
              Previous
            </button>
          )}

          {step < stepsCount ? (
            <button
              onClick={handleNext}
              disabled={!businessName}
              className="flex-1 py-3 bg-[#0F1020] text-white hover:bg-[#171A30] text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-3 bg-[#0F1020] text-white hover:bg-[#171A30] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Website
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default WebsiteWizard;

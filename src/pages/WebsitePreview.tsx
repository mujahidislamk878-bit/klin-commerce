import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Monitor, Laptop, Tablet, Smartphone, Moon, Sun, AlignLeft, AlignRight, Users, Globe } from "lucide-react";
import { WebsiteRuntime } from "../runtime/core/WebsiteRuntime";
import { RuntimeResolver } from "../runtime/core/RuntimeResolver";
import { WebsiteRenderer } from "../runtime/core/WebsiteRenderer";
import { RuntimeProvider } from "../runtime/core/RuntimeContext";
import { createRenderContext, RenderContext } from "../runtime/core/RenderContext";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

interface WebsitePreviewProps {
  websiteId: string;
  onBack: () => void;
}

export function WebsitePreview({ websiteId, onBack }: WebsitePreviewProps) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState("home");

  // Preview simulator option states
  const [device, setDevice] = useState<"Desktop" | "Laptop" | "Tablet" | "Mobile">("Desktop");
  const [themeMode, setThemeMode] = useState<"Light" | "Dark">("Light");
  const [direction, setDirection] = useState<"LTR" | "RTL">("LTR");
  const [locale, setLocale] = useState("en");
  const [role, setRole] = useState<"Guest" | "Customer" | "Admin">("Guest");

  useEffect(() => {
    const fetchSite = async () => {
      try {
        let token = "";
        const stored = localStorage.getItem("klin_user_session");
        if (stored) {
          const session = JSON.parse(stored);
          token = session.token || "";
        }
        const res = await fetch(`http://localhost:5000/api/websites/${websiteId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.website) {
          setSiteData(result.website);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [websiteId]);

  // Construct render context dynamically based on selected simulator inputs
  const resolvedRenderContext = useMemo<RenderContext | null>(() => {
    if (!siteData) return null;

    const baseCtx = WebsiteRuntime.buildContextFromRaw(siteData, activeSlug, {
      device,
      direction,
      locale,
      userSession: {
        isAuthenticated: role !== "Guest",
        role: role,
        email: role === "Admin" ? "admin@klin.store" : "buyer@example.com",
        name: role === "Admin" ? "Site Administrator" : "John Doe"
      },
      currency: locale === "en" ? "USD" : locale === "es" ? "MXN" : "EUR"
    });

    // Handle theme color scheme dark mode toggles manually
    const resolvedTheme = { ...baseCtx.theme };
    if (themeMode === "Dark") {
      resolvedTheme.colors = {
        ...resolvedTheme.colors,
        background: "#0f172a",
        foreground: "#f8fafc",
      };
    } else {
      resolvedTheme.colors = {
        ...resolvedTheme.colors,
        background: "#ffffff",
        foreground: "#0f172a",
      };
    }

    const modifiedCtx = {
      ...baseCtx,
      theme: resolvedTheme
    };

    // Return completely resolved context passing through all Resolver steps
    return RuntimeResolver.resolve(modifiedCtx);
  }, [siteData, activeSlug, device, themeMode, direction, locale, role]);

  const canvasWidth = useMemo(() => {
    switch (device) {
      case "Laptop": return "1024px";
      case "Tablet": return "768px";
      case "Mobile": return "375px";
      default: return "100%";
    }
  }, [device]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center relative font-sans">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
          <p className="text-xs text-black/50 font-mono">Initializing Render Pipeline...</p>
        </div>
      </div>
    );
  }

  if (!siteData || !resolvedRenderContext) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <p className="text-sm text-red-500 font-semibold">Failed to resolve preview context.</p>
          <button onClick={onBack} className="px-4 py-2 bg-black text-white rounded-xl text-xs font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF0F5] flex flex-col font-sans relative overflow-hidden">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Preview Simulator Header */}
      <header className="h-16 border-b border-black/5 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0F1020]/60 hover:text-black transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="h-4 w-px bg-black/10" />
          <div>
            <h1 className="text-xs font-bold truncate max-w-[120px] sm:max-w-none">{siteData.name}</h1>
            <p className="text-[10px] text-[#0F1020]/40 font-mono">Live Preview Engine</p>
          </div>
        </div>

        {/* Responsive viewports */}
        <div className="hidden md:flex items-center gap-1 rounded-full bg-black/5 p-1 border border-black/5">
          {([
            { id: "Desktop", icon: Monitor },
            { id: "Laptop", icon: Laptop },
            { id: "Tablet", icon: Tablet },
            { id: "Mobile", icon: Smartphone }
          ] as const).map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`p-1.5 rounded-full transition ${
                  device === d.id ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
                }`}
                title={`${d.id} view`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Simulator controls */}
        <div className="flex items-center gap-3">
          {/* Page Switcher */}
          <select
            value={activeSlug}
            onChange={(e) => setActiveSlug(e.target.value)}
            className="text-xs font-semibold bg-black/5 rounded-xl border-none focus:ring-0 cursor-pointer"
          >
            {(siteData.pages || []).map((p: any) => (
              <option key={p.slug} value={p.slug}>/{p.slug}</option>
            ))}
          </select>

          {/* Theme switcher */}
          <button
            onClick={() => setThemeMode(themeMode === "Light" ? "Dark" : "Light")}
            className="p-2 hover:bg-black/5 rounded-xl transition text-black/60 hover:text-black"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === "Light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* LTR/RTL Toggle */}
          <button
            onClick={() => setDirection(direction === "LTR" ? "RTL" : "LTR")}
            className="p-2 hover:bg-black/5 rounded-xl transition text-black/60 hover:text-black"
            title="Toggle LTR/RTL Layout"
          >
            {direction === "LTR" ? <AlignLeft className="h-4 w-4" /> : <AlignRight className="h-4 w-4" />}
          </button>

          {/* Localized Switcher */}
          <div className="flex items-center gap-1 bg-black/5 rounded-xl px-2 py-1">
            <Globe className="h-3.5 w-3.5 text-black/50" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="text-[10px] font-bold border-none bg-transparent focus:ring-0 py-0.5 pl-1 cursor-pointer pr-5"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (MX)</option>
              <option value="fr">Français (FR)</option>
            </select>
          </div>

          {/* Role simulation */}
          <div className="flex items-center gap-1 bg-black/5 rounded-xl px-2 py-1">
            <Users className="h-3.5 w-3.5 text-black/50" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="text-[10px] font-bold border-none bg-transparent focus:ring-0 py-0.5 pl-1 cursor-pointer pr-5"
            >
              <option value="Guest">Guest</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>
        </div>
      </header>

      {/* Simulator canvas body */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#EEF0F5]">
        <div
          className="bg-white rounded-[32px] border border-black/5 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
          style={{ width: canvasWidth, maxWidth: "100%", minHeight: "100%" }}
        >
          <div className="flex-1 relative overflow-y-auto">
            <RuntimeProvider context={resolvedRenderContext}>
              <WebsiteRenderer context={resolvedRenderContext} />
            </RuntimeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
export default WebsitePreview;

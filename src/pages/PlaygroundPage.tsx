"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Puck, type Data } from "@measured/puck";
import { ArrowLeft, Save, Globe, Eye, Smartphone, Tablet, Monitor } from "lucide-react";
import { puckConfig } from "@/lib/puck-config";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

export function PlaygroundPage() {
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const [website, setWebsite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePageSlug, setActivePageSlug] = useState("home");
  const [puckData, setPuckData] = useState<Data>({ content: [], root: {} });
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Debounce ref for autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("websiteId");
    setWebsiteId(id);
  }, []);

  useEffect(() => {
    if (!websiteId) return;

    const fetchWebsite = async () => {
      try {
        const token = localStorage.getItem("klin_token");
        const res = await fetch(`http://localhost:5000/api/websites/${websiteId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.website) {
          setWebsite(result.website);
          const websitePages = result.website.pages || [];
          setPages(websitePages);
          
          // Load active page JSON
          const matched = websitePages.find((p: any) => p.slug === activePageSlug);
          if (matched && matched.builderJson) {
            setPuckData(matched.builderJson);
          } else if (websitePages.length > 0) {
            setPuckData(websitePages[0].builderJson || { content: [], root: {} });
            setActivePageSlug(websitePages[0].slug);
          }
        }
      } catch (e) {
        console.error("Failed to load website for builder", e);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [websiteId, activePageSlug]);

  const handlePuckChange = (nextData: Data) => {
    setPuckData(nextData);

    // Debounced autosave
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("klin_token");
        // Map updated Puck JSON back to pages list
        const nextPages = pages.map((p) => {
          if (p.slug === activePageSlug) {
            return { ...p, builderJson: nextData };
          }
          return p;
        });
        setPages(nextPages);

        await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ pages: nextPages })
        });
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }, 1500); // 1.5s debounce
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("klin_token");
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Website snapshot published!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const canvasWidth = useMemo(() => {
    switch (device) {
      case "tablet": return 768;
      case "mobile": return 375;
      default: return "100%";
    }
  }, [device]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] flex items-center justify-center relative overflow-hidden font-sans">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-8 h-8 border-2 border-black/10 border-t-[#0F1020] rounded-full animate-spin" />
          <p className="text-[#0F1020]/60 text-xs font-mono">Loading Puck Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col font-sans relative overflow-hidden">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Editor Header Bar */}
      <header className="h-16 border-b border-black/5 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = `/dashboard/websites/${websiteId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0F1020]/60 hover:text-black transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="h-4 w-px bg-black/10" />
          <div>
            <h1 className="text-sm font-bold">{website?.name}</h1>
            <p className="text-[10px] text-[#0F1020]/40 font-mono">Editing /{activePageSlug}</p>
          </div>
        </div>

        {/* Viewport breakpoints */}
        <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
          {([
            { id: "desktop", icon: Monitor },
            { id: "tablet", icon: Tablet },
            { id: "mobile", icon: Smartphone }
          ] as const).map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`p-1.5 rounded-full transition ${
                  device === d.id ? "bg-white text-[#0F1020] shadow-sm" : "text-[#0F1020]/45"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Page Selector & Save Indicator */}
        <div className="flex items-center gap-3">
          <select
            value={activePageSlug}
            onChange={(e) => setActivePageSlug(e.target.value)}
            className="text-xs font-semibold bg-black/5 rounded-xl border-none focus:ring-0 cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>

          <span className="text-[11px] font-mono text-[#0F1020]/50">
            {saving ? "Saving changes..." : "All changes saved"}
          </span>

          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            Publish
          </button>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#EEF0F5]">
        <div
          className="bg-white rounded-[32px] border border-black/5 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
          style={{ width: canvasWidth, maxWidth: "100%", minHeight: "600px" }}
        >
          <div className="flex-1 relative">
            <Puck
              config={puckConfig}
              data={puckData}
              onChange={handlePuckChange}
              overrides={{
                header: () => <div />,
                headerActions: () => <div />,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Monitor, Tablet, Smartphone, Info, Layers, Tag, ShieldCheck, ChevronRight } from "lucide-react";
import { WebsiteRenderer } from "../../runtime/core/WebsiteRenderer";

// Isolated Portal IFrame to isolate viewport size and trigger native Tailwind media queries
function PreviewIframe({ 
  children, 
  title, 
  className 
}: { 
  children: React.ReactNode; 
  title: string; 
  className?: string;
}) {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (!contentRef) return;
    const doc = contentRef.contentWindow?.document;
    if (!doc) return;

    const iframeHead = doc.head;
    
    // Copy link stylesheets and style blocks from parent window head to apply Tailwind / Google Fonts
    Array.from(document.head.querySelectorAll("link, style")).forEach((el) => {
      iframeHead.appendChild(el.cloneNode(true));
    });

    // Reset iframe default body styles
    doc.body.style.margin = "0";
    doc.body.style.padding = "0";
    doc.body.style.backgroundColor = "transparent";
  }, [contentRef]);

  return (
    <iframe 
      title={title} 
      ref={setContentRef} 
      className={className} 
      style={{ width: "100%", height: "100%", border: "none" }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

interface TemplatePreviewModalProps {
  template: any;
  onClose: () => void;
  onInstall: () => void;
  isInstalling?: boolean;
}

export function TemplatePreviewModal({ template, onClose, onInstall, isInstalling }: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeSlug, setActiveSlug] = useState(() => template.pages?.[0]?.slug || "home");

  const pageTabs = useMemo(() => {
    return template.pages || [];
  }, [template]);

  const activePage = useMemo(() => {
    return pageTabs.find((p: any) => p.slug === activeSlug) || pageTabs[0];
  }, [pageTabs, activeSlug]);

  // Construct mock render context for WebsiteRenderer compilation
  const mockRenderContext = useMemo(() => {
    return {
      website: {
        id: template._id || "preview-id",
        name: template.name,
        metadata: {
          websiteName: template.name,
          websiteDescription: template.description || "",
          logo: template.thumbnail || ""
        }
      },
      page: {
        name: activePage?.title || "Home",
        slug: activePage?.slug || "home",
        layout: activePage?.builderJson || { content: [] }
      },
      theme: template.theme || { colors: {} },
      device: device === "desktop" ? "Desktop" : device === "tablet" ? "Tablet" : "Mobile",
      direction: "LTR",
      locale: "en",
      currency: "USD",
      userSession: { isAuthenticated: false },
      cmsData: {},
      commerceData: {}
    };
  }, [template, activePage, device]);

  const iframeWidth = useMemo(() => {
    switch (device) {
      case "tablet": return "768px";
      case "mobile": return "375px";
      default: return "100%";
    }
  }, [device]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1020]/95 backdrop-blur-md flex flex-col font-sans text-white">
      {/* Header bar */}
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0F1020]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold">{template.name}</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">{template.category} Layout</p>
          </div>
        </div>

        {/* Page Switcher Tabs at the top main header */}
        {pageTabs.length > 1 && (
          <div className="flex gap-1.5 bg-white/5 border border-white/5 rounded-full p-1">
            {pageTabs.map((p: any) => (
              <button
                key={p.slug}
                onClick={() => setActiveSlug(p.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeSlug === p.slug ? "bg-white text-[#0F1020]" : "text-white/60 hover:text-white"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Viewport controls */}
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/5">
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
                    device === d.id ? "bg-white text-[#0F1020]" : "text-white/60 hover:text-white"
                  }`}
                  title={`${d.id} viewport`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <button
            onClick={onInstall}
            disabled={isInstalling}
            className="px-5 py-2 bg-white text-[#0F1020] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
          >
            {isInstalling ? "Installing..." : "Use Template"}
            {!isInstalling && <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Mock Browser Preview Canvas */}
        <div className="flex-1 bg-[#121324] p-8 flex flex-col items-center justify-center overflow-hidden">
          <motion.div
            layout
            style={{ width: iframeWidth, height: "100%", maxHeight: "100%" }}
            className="bg-white text-black shadow-2xl rounded-[24px] overflow-hidden flex flex-col transition-all duration-300"
          >
            {/* Real browser-like window toolbar header chrome (removes Engine and paths) */}
            <div className="bg-neutral-50 border-b border-black/5 px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-black/40 font-mono tracking-wider font-semibold">Preview</span>
              <div className="w-10" />
            </div>

            {/* Dynamic website layout content compiler */}
            <div className="flex-1 bg-white overflow-hidden relative">
              <PreviewIframe 
                title="Template Viewport Frame"
                className="w-full h-full"
              >
                <div 
                  className="w-full h-full overflow-y-auto scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <WebsiteRenderer context={mockRenderContext as any} />
                </div>
              </PreviewIframe>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Metadata Cards */}
        <aside className="w-80 border-l border-white/10 bg-[#0F1020]/95 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold border-b border-white/15 pb-2.5 mb-3 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-blue-400" /> Template Meta Info
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {template.description || "Immutable template package built for the Klin enterprise builder canvas."}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-white/60">Category</span>
                </div>
                <span className="font-bold">{template.category}</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-white/60">Total Pages</span>
                </div>
                <span className="font-bold">{pageTabs.length} Page</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-white/60">Compatible</span>
                </div>
                <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Builder {template.compatibility?.builder || "v3"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Active Page Blocks</span>
              <div className="flex flex-wrap gap-1.5">
                {(activePage?.builderJson?.content || []).map((block: any, idx: number) => (
                  <span key={block.id || idx} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] font-mono text-white/60">
                    {block.type}
                  </span>
                ))}
                {(activePage?.builderJson?.content || []).length === 0 && (
                  <span className="text-[10px] text-white/40 italic">Empty page canvas layout</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-white/40 block">Author Details</span>
            <span className="text-xs font-bold text-indigo-300">{template.author || "Klin Developer"}</span>
            <span className="text-[10px] text-white/50 block">Version {template.version || "1.0.0"}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default TemplatePreviewModal;

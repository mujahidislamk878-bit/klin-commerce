import React, { useEffect, useState } from "react";
import { RuntimeService } from "../runtime/services/RuntimeService";
import { RuntimeProvider } from "../runtime/core/RuntimeContext";
import { WebsiteRenderer } from "../runtime/core/WebsiteRenderer";
import { RenderContext } from "../runtime/core/RenderContext";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";

interface WebsiteLiveViewerProps {
  subdomain: string;
  pageSlug?: string;
}

export function WebsiteLiveViewer({ subdomain, pageSlug = "home" }: WebsiteLiveViewerProps) {
  const [context, setContext] = useState<RenderContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setError(null);
      try {
        const ctx = await RuntimeService.initializeRuntime(subdomain, pageSlug);
        if (ctx) {
          setContext(ctx);
        } else {
          setError(`Website matching subdomain '${subdomain}' not resolved.`);
        }
      } catch (err: any) {
        setError(err.message || "Failed to compile layout renderer pipeline");
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [subdomain, pageSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative font-sans text-black">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
          <p className="text-xs text-black/50 font-mono">Compiling Static Assets...</p>
        </div>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-6 font-sans text-black">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="text-center space-y-4 max-w-md bg-white border border-black/5 shadow-2xl rounded-[32px] p-8 z-10">
          <h2 className="text-lg font-bold">404 — Site Not Found</h2>
          <p className="text-black/60 text-xs">{error || "Missing snapshot build configuration."}</p>
          <a
            href="/"
            className="block w-full py-3 bg-[#0F1020] text-white font-semibold rounded-xl text-xs hover:bg-[#171A30] transition text-center"
          >
            Go back to Klin Builder
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative font-sans text-black">
      <RuntimeProvider context={context}>
        <WebsiteRenderer context={context} />
      </RuntimeProvider>
    </div>
  );
}
export default WebsiteLiveViewer;

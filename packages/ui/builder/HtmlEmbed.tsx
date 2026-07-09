"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

// ── Props ──

export interface HtmlEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Raw HTML string to render inside the iframe */
  html: string;
  /** Apply sandbox attribute to iframe (default true) */
  sandbox?: boolean;
  /** Iframe height (default "auto") */
  height?: string | number;
  /** Iframe max-height */
  maxHeight?: string | number;
  /** Allow scrolling inside the wrapper (default true) */
  scrollable?: boolean;
}

// ── Component ──

const HtmlEmbed = React.forwardRef<HTMLDivElement, HtmlEmbedProps>(
  (
    {
      className,
      html,
      sandbox = true,
      height,
      maxHeight,
      scrollable = true,
      style,
      ...props
    },
    ref,
  ) => {
    // ── Blob URL for content isolation ──
    const blobUrl = React.useMemo(() => {
      if (typeof window === "undefined") return "";
      try {
        const blob = new Blob([html], { type: "text/html" });
        return URL.createObjectURL(blob);
      } catch {
        return "";
      }
    }, [html]);

    // ── Revoke blob URL on unmount ──
    React.useEffect(() => {
      return () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    }, [blobUrl]);

    const iframeHeight = height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : undefined;

    const iframeMaxHeight = maxHeight
      ? typeof maxHeight === "number"
        ? `${maxHeight}px`
        : maxHeight
      : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full",
          scrollable && "overflow-auto",
          className,
        )}
        style={{
          ...(iframeHeight ? { height: iframeHeight } : {}),
          ...(iframeMaxHeight ? { maxHeight: iframeMaxHeight } : {}),
          ...style,
        }}
        {...props}
      >
        <iframe
          src={blobUrl || undefined}
          srcDoc={!blobUrl ? html : undefined}
          title="html-embed"
          className="w-full h-full border-0"
          sandbox={
            sandbox
              ? "allow-scripts allow-same-origin allow-forms allow-popups"
              : undefined
          }
          style={{
            minHeight: iframeHeight ? undefined : 100,
            ...(iframeHeight ? { height: "100%" } : {}),
          }}
        />
      </div>
    );
  },
);
HtmlEmbed.displayName = "HtmlEmbed";

export { HtmlEmbed };
export default HtmlEmbed;

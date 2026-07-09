"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Dribbble,
  Mail,
  Globe,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { FooterProps } from "../../types";
import { Container } from "../layout/Container";

// ── Icon map ──

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  dribbble: Dribbble,
  mail: Mail,
  globe: Globe,
};

// ── Variant maps ──

const wrapperVariants: Record<string, string> = {
  default: "bg-background border-t border-border",
  centered: "bg-background border-t border-border",
  minimal: "bg-background border-t border-border",
  dark: "bg-gray-900 text-gray-300 border-gray-800",
  split: "bg-background border-t border-border",
};

const textVariants: Record<string, string> = {
  default: "text-muted-foreground",
  centered: "text-muted-foreground",
  minimal: "text-muted-foreground",
  dark: "text-gray-400",
  split: "text-muted-foreground",
};

const linkVariants: Record<string, string> = {
  default: "text-muted-foreground hover:text-foreground",
  centered: "text-muted-foreground hover:text-foreground",
  minimal: "text-muted-foreground hover:text-foreground",
  dark: "text-gray-400 hover:text-white",
  split: "text-muted-foreground hover:text-foreground",
};

// ── Component ──

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  (
    {
      className,
      brand,
      columns,
      socialLinks,
      copyright,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const renderSocialIcon = (iconName: string) => {
      const Icon = iconMap[iconName.toLowerCase()];
      if (Icon) {
        return <Icon className="h-5 w-5" aria-hidden="true" />;
      }
      return <Globe className="h-5 w-5" aria-hidden="true" />;
    };

    const renderSocialLinks = () => {
      if (!socialLinks?.length) return null;
      return (
        <div className="flex items-center gap-3">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors",
                variant === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary",
              )}
              aria-label={`Social link ${i + 1}`}
            >
              {renderSocialIcon(link.icon)}
            </a>
          ))}
        </div>
      );
    };

    // ── Minimal variant ──
    if (variant === "minimal") {
      return (
        <motion.div
          ref={ref}
          className={cn(wrapperVariants[variant], className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          <Container className="py-6">
            <div className="flex items-center justify-between">
              {copyright && (
                <p className={cn("text-sm", textVariants[variant])}>
                  {copyright}
                </p>
              )}
              {renderSocialLinks()}
            </div>
          </Container>
        </motion.div>
      );
    }

    // ── Centered variant ──
    if (variant === "centered") {
      return (
        <motion.div
          ref={ref}
          className={cn(wrapperVariants[variant], className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          <Container className="py-12 text-center">
            {brand && (
              <div className="mb-6">
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 mx-auto mb-2"
                  />
                )}
                {brand.name && (
                  <p className="text-lg font-semibold">{brand.name}</p>
                )}
                {brand.description && (
                  <p className={cn("mt-2 text-sm max-w-md mx-auto", textVariants[variant])}>
                    {brand.description}
                  </p>
                )}
              </div>
            )}

            {columns && columns.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 mb-6">
                {columns.map((col, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map((link, j) => (
                        <li key={j}>
                          <a
                            href={link.href}
                            className={cn(
                              "text-sm transition-colors",
                              linkVariants[variant],
                            )}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {renderSocialLinks()}

            {copyright && (
              <p className={cn("mt-8 text-sm", textVariants[variant])}>
                {copyright}
              </p>
            )}
          </Container>
        </motion.div>
      );
    }

    // ── Split variant ──
    if (variant === "split") {
      return (
        <motion.div
          ref={ref}
          className={cn(wrapperVariants[variant], className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          <Container className="py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Brand */}
              <div className="lg:w-1/3">
                {brand && (
                  <div>
                    {brand.logo && (
                      <img src={brand.logo} alt={brand.name} className="h-8 mb-3" />
                    )}
                    {brand.name && (
                      <p className="text-lg font-semibold mb-2">{brand.name}</p>
                    )}
                    {brand.description && (
                      <p className={cn("text-sm", textVariants[variant])}>
                        {brand.description}
                      </p>
                    )}
                  </div>
                )}
                {renderSocialLinks()}
              </div>

              {/* Columns */}
              {columns && columns.length > 0 && (
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                  {columns.map((col, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
                      <ul className="space-y-2">
                        {col.links.map((link, j) => (
                          <li key={j}>
                            <a
                              href={link.href}
                              className={cn(
                                "text-sm transition-colors",
                                linkVariants[variant],
                              )}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {copyright && (
              <div className={cn("mt-10 pt-6 border-t text-sm", textVariants[variant])}>
                <p>{copyright}</p>
              </div>
            )}
          </Container>
        </motion.div>
      );
    }

    // ── Default / Dark variant ──
    return (
      <motion.div
        ref={ref}
        className={cn(wrapperVariants[variant], className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <Container className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand column */}
            {brand && (
              <div className="lg:col-span-1">
                {brand.logo && (
                  <img src={brand.logo} alt={brand.name} className="h-8 mb-3" />
                )}
                {brand.name && (
                  <p className="text-lg font-semibold mb-2">{brand.name}</p>
                )}
                {brand.description && (
                  <p className={cn("text-sm mb-4", textVariants[variant])}>
                    {brand.description}
                  </p>
                )}
                {renderSocialLinks()}
              </div>
            )}

            {/* Link columns */}
            {columns?.map((col, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={link.href}
                        className={cn(
                          "text-sm transition-colors",
                          linkVariants[variant],
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {copyright && (
            <div
              className={cn(
                "mt-10 pt-6 border-t text-sm",
                variant === "dark" ? "border-gray-800" : "border-border",
                textVariants[variant],
              )}
            >
              <p>{copyright}</p>
            </div>
          )}
        </Container>
      </motion.div>
    );
  },
);

Footer.displayName = "Footer";

export { Footer };
export default Footer;

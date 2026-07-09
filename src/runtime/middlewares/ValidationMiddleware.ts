import { RenderContext } from "../core/RenderContext";

export interface ValidationIssue {
  type: "accessibility" | "seo" | "broken-links" | "missing-assets" | "invalid-theme";
  message: string;
  severity: "error" | "warning";
}

export class ValidationMiddleware {
  public static validate(context: RenderContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check empty title or SEO tags
    if (!context.seo?.title || context.seo.title.trim() === "") {
      issues.push({
        type: "seo",
        message: "Missing website header title meta tag.",
        severity: "warning",
      });
    }

    // Check empty theme values
    if (!context.theme?.colors?.primary) {
      issues.push({
        type: "invalid-theme",
        message: "Theme PRIMARY color token is undefined.",
        severity: "error",
      });
    }

    // Check broken navigation links
    if (context.navigation) {
      context.navigation.forEach((menu) => {
        menu.links?.forEach((link: any) => {
          if (!link.href || link.href.trim() === "") {
            issues.push({
              type: "broken-links",
              message: `Empty href target in navigation menu '${menu.name}'.`,
              severity: "warning",
            });
          }
        });
      });
    }

    // Verify empty page layouts
    const blocks = context.page?.layout?.content || [];
    if (blocks.length === 0) {
      issues.push({
        type: "accessibility",
        message: `Active page '/${context.page?.slug}' is empty. Add layout blocks.`,
        severity: "warning",
      });
    }

    return issues;
  }
}
export default ValidationMiddleware;

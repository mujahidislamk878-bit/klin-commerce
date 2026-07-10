import React from "react";
import type { Config } from "@measured/puck";
import { Registry } from "../../packages/registry";

export interface CreatePuckConfigOptions {
  includeHidden?: boolean;
  categoryFilter?: string[];
}

/**
 * Dynamically converts registry fields into Puck fields.
 */
function convertRegistrySchemaToPuckFields(schema: Record<string, any>): Record<string, any> {
  const puckFields: Record<string, any> = {};

  for (const [key, field] of Object.entries(schema)) {
    if (!field) continue;
    const type = field.type;
    if (!type) continue;

    const puckField: any = {
      type,
      label: field.label || key,
    };

    if (type === "number") {
      if (field.min !== undefined) puckField.min = field.min;
      if (field.max !== undefined) puckField.max = field.max;
    } else if (type === "select" || type === "radio") {
      if (field.options) {
        puckField.options = field.options;
      }
    } else if (type === "object") {
      const subfields = field.subfields || field.objectFields;
      if (subfields) {
        const converted = convertRegistrySchemaToPuckFields(subfields);
        puckField.objectFields = converted;
        puckField.subfields = converted;
      }
    } else if (type === "array") {
      const arrayFields = field.arrayFields || field.subfields;
      if (arrayFields) {
        const converted = convertRegistrySchemaToPuckFields(arrayFields);
        puckField.arrayFields = converted;
        puckField.subfields = converted;
      }
      if (field.getItemSummary) {
        puckField.getItemSummary = field.getItemSummary;
      }
    }

    puckFields[key] = puckField;
  }

  return puckFields;
}

/**
 * Automatically builds a Puck configuration based on the canonical Component Registry.
 */
export function createPuckConfig(options: CreatePuckConfigOptions = {}): Config<any> {
  const { includeHidden = false, categoryFilter } = options;

  const components: Record<string, any> = {};
  const categories: Record<string, { components: string[] }> = {};

  // Retrieve components using the Registry API
  const builderComponents = Registry.getBuilderComponents({
    includeHidden,
    panelFilter: categoryFilter,
  });

  builderComponents.forEach((entry) => {
    const builderPanel = entry.builder?.panel || entry.domain;

    // Register component render and fields
    components[entry.id] = {
      fields: convertRegistrySchemaToPuckFields(entry.schema),
      defaultProps: entry.defaultProps || {},
      render: (props: any) => {
        const Component = entry.component;
        const { showBorder, editMode, puck, ...cleanProps } = props;

        // Resolve universal style and layout props into an inline styles object
        const styles: React.CSSProperties = {};

        if (props.width) styles.width = props.width;
        if (props.height) styles.height = props.height;
        if (props.minHeight) styles.minHeight = props.minHeight;
        if (props.maxWidth) styles.maxWidth = props.maxWidth;
        if (props.align) styles.textAlign = props.align as any;
        if (props.position) styles.position = props.position as any;
        if (props.overflow) styles.overflow = props.overflow as any;
        if (props.zIndex !== undefined && props.zIndex !== null) styles.zIndex = Number(props.zIndex);
        if (props.opacity !== undefined && props.opacity !== null) styles.opacity = Number(props.opacity);
        if (props.blur) styles.filter = `blur(${props.blur})`;

        if (props.bgColor) styles.backgroundColor = props.bgColor;
        if (props.bgImage && props.bgType === "image") styles.backgroundImage = `url(${props.bgImage})`;
        if (props.bgGradient && props.bgType === "gradient") styles.background = props.bgGradient;

        if (props.borderWidth) styles.borderWidth = props.borderWidth;
        if (props.borderColor) styles.borderColor = props.borderColor;
        if (props.borderStyle) styles.borderStyle = props.borderStyle;

        // Map radius values
        const radiusMap: Record<string, string> = {
          none: "0px",
          sm: "4px",
          md: "8px",
          lg: "12px",
          xl: "24px",
          full: "9999px",
        };
        if (props.radius && radiusMap[props.radius]) {
          styles.borderRadius = radiusMap[props.radius];
        }

        // Map shadows
        const shadowMap: Record<string, string> = {
          none: "none",
          sm: "0 1px 2px rgba(0,0,0,0.05)",
          md: "0 4px 6px rgba(0,0,0,0.1)",
          lg: "0 10px 15px rgba(0,0,0,0.1)",
          xl: "0 20px 25px rgba(0,0,0,0.15)",
        };
        if (props.shadow && shadowMap[props.shadow]) {
          styles.boxShadow = shadowMap[props.shadow];
        }

        // Generate a unique CSS class name for this component instance
        const wrapperId = `klin-wrap-${props.id || Math.random().toString(36).substr(2, 9)}`;

        // Spacing properties (padding & margin) are resolved responsively using media queries
        const p = props.padding || {};
        const m = props.margin || {};
        const pDesktop = typeof p === "string" ? p : p.desktop || "0px";
        const mDesktop = typeof m === "string" ? m : m.desktop || "0px";

        const pTabletL = typeof p === "string" ? p : p.tabletLandscape || p.desktop || "0px";
        const mTabletL = typeof m === "string" ? m : m.tabletLandscape || m.desktop || "0px";

        const pTabletP = typeof p === "string" ? p : p.tabletPortrait || p.tabletLandscape || p.desktop || "0px";
        const mTabletP = typeof m === "string" ? m : m.tabletPortrait || m.tabletLandscape || m.desktop || "0px";

        const pMobileL = typeof p === "string" ? p : p.mobileLandscape || p.tabletPortrait || p.tabletLandscape || p.desktop || "0px";
        const mMobileL = typeof m === "string" ? m : m.mobileLandscape || m.tabletPortrait || m.tabletLandscape || m.desktop || "0px";

        const pMobileP = typeof p === "string" ? p : p.mobilePortrait || p.mobileLandscape || p.tabletPortrait || p.tabletLandscape || p.desktop || "0px";
        const mMobileP = typeof m === "string" ? m : m.mobilePortrait || m.mobileLandscape || m.tabletPortrait || m.tabletLandscape || m.desktop || "0px";

        const cssContent = `
          .${wrapperId} {
            padding: ${pDesktop};
            margin: ${mDesktop};
          }
          @media (max-width: 1199px) {
            .${wrapperId} {
              padding: ${pTabletL};
              margin: ${mTabletL};
            }
          }
          @media (max-width: 1023px) {
            .${wrapperId} {
              padding: ${pTabletP};
              margin: ${mTabletP};
            }
          }
          @media (max-width: 767px) {
            .${wrapperId} {
              padding: ${pMobileL};
              margin: ${mMobileL};
            }
          }
          @media (max-width: 479px) {
            .${wrapperId} {
              padding: ${pMobileP};
              margin: ${mMobileP};
            }
          }
        `;

        return React.createElement(
          "div",
          { style: styles, className: `klin-universal-wrapper w-full ${wrapperId}` },
          React.createElement("style", { dangerouslySetInnerHTML: { __html: cssContent } }),
          React.createElement(Component, cleanProps)
        );
      },
    };

    // Place component inside category bucket
    if (!categories[builderPanel]) {
      categories[builderPanel] = { components: [] };
    }
    categories[builderPanel].components.push(entry.id);
  });

  // Sort components within each category using builder.order if available
  Object.keys(categories).forEach((catName) => {
    categories[catName].components.sort((a, b) => {
      const entryA = Registry.get(a);
      const entryB = Registry.get(b);
      const orderA = entryA?.builder?.order ?? 100;
      const orderB = entryB?.builder?.order ?? 100;
      return orderA - orderB;
    });
  });

  return {
    categories,
    components,
  };
}

export default createPuckConfig;

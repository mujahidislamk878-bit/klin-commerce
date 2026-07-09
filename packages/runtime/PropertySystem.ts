"use client";

export interface PropertyDefinition {
  type: "text" | "number" | "boolean" | "select" | "color" | "image" | "responsive" | "action" | "cms" | "asset";
  label: string;
  group?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  defaultValue?: any;
}

export const textProperty = (label: string, defaultValue?: string, group = "Content"): PropertyDefinition => ({
  type: "text",
  label,
  group,
  defaultValue,
});

export const numberProperty = (label: string, min?: number, max?: number, defaultValue?: number, group = "Content"): PropertyDefinition => ({
  type: "number",
  label,
  group,
  min,
  max,
  defaultValue,
});

export const booleanProperty = (label: string, defaultValue = false, group = "Content"): PropertyDefinition => ({
  type: "boolean",
  label,
  group,
  defaultValue,
});

export const colorProperty = (label: string, defaultValue?: string, group = "Colors"): PropertyDefinition => ({
  type: "color",
  label,
  group,
  defaultValue,
});

export const selectProperty = (label: string, options: { label: string; value: any }[], defaultValue?: any, group = "Content"): PropertyDefinition => ({
  type: "select",
  label,
  group,
  options,
  defaultValue,
});

export const imageProperty = (label: string, group = "Assets"): PropertyDefinition => ({
  type: "image",
  label,
  group,
});

export const responsiveProperty = (label: string, baseProperty: PropertyDefinition, group = "Responsive"): PropertyDefinition => ({
  type: "responsive",
  label,
  group,
  defaultValue: { desktop: baseProperty.defaultValue, tablet: baseProperty.defaultValue, mobile: baseProperty.defaultValue },
});

export const actionProperty = (label: string, group = "Actions"): PropertyDefinition => ({
  type: "action",
  label,
  group,
});

export const cmsProperty = (label: string, group = "CMS"): PropertyDefinition => ({
  type: "cms",
  label,
  group,
});

export const assetProperty = (label: string, group = "Assets"): PropertyDefinition => ({
  type: "asset",
  label,
  group,
});

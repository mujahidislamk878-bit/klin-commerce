"use client";

import type { Action, ActionType, ThemeTokens } from "../types";

export interface ComponentMetadata {
  id: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  author: string;
  supports?: {
    children?: boolean;
    responsive?: boolean;
    theme?: boolean;
    animation?: boolean;
    actions?: boolean;
    cms?: boolean;
    commerce?: boolean;
    assets?: boolean;
    variants?: boolean;
    presets?: boolean;
  };
  defaultProps?: Record<string, any>;
  themeTokensUsed?: string[];
  allowedChildren?: string[];
  inspectorGroups?: string[];
  deprecation?: { status: boolean; message?: string };
  keywords?: string[];
  docRef?: string;
}

export type PropertyValidator = (props: Record<string, any>) => string[];

export interface BuilderPlugin {
  name: string;
  onInit?: (context: any) => void;
  onDestroy?: () => void;
}

class DeveloperAPIRegistry {
  public components = new Map<string, ComponentMetadata>();
  public categories = new Set<string>();
  public inspectorGroups = new Set<string>();
  public actions = new Map<ActionType, (action: Action) => void>();
  public validators = new Map<string, PropertyValidator>();
  public presets = new Map<string, Record<string, any>[]>();
  public variants = new Map<string, Record<string, any>[]>();
  public bindings = new Map<string, (source: any) => any>();
  public plugins: BuilderPlugin[] = [];

  registerComponent(metadata: ComponentMetadata) {
    this.components.set(metadata.id, metadata);
    this.categories.add(metadata.category);
  }

  registerCategory(category: string) {
    this.categories.add(category);
  }

  registerInspectorGroup(group: string) {
    this.inspectorGroups.add(group);
  }

  registerAction(type: ActionType, handler: (action: Action) => void) {
    this.actions.set(type, handler);
  }

  registerValidator(componentId: string, validator: PropertyValidator) {
    this.validators.set(componentId, validator);
  }

  registerPreset(componentId: string, propPresets: Record<string, any>[]) {
    this.presets.set(componentId, propPresets);
  }

  registerVariant(componentId: string, propVariants: Record<string, any>[]) {
    this.variants.set(componentId, propVariants);
  }

  registerBinding(sourceType: string, resolver: (source: any) => any) {
    this.bindings.set(sourceType, resolver);
  }

  registerPlugin(plugin: BuilderPlugin) {
    this.plugins.push(plugin);
  }
}

export const klinAPIs = new DeveloperAPIRegistry();

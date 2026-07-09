"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { HistoryEngine, type HistorySnapshot } from "./HistoryEngine";
import { ClipboardEngine, type ClipboardItem } from "./ClipboardEngine";
import { CommandEngine, type Command } from "./CommandEngine";
import { AssetEngine, type Asset } from "./AssetEngine";
import { ValidationEngine, type ValidationError } from "./ValidationEngine";
import { AccessibilityRuntime, type AccessibilityIssue } from "./AccessibilityRuntime";
import type { ThemeTokens } from "../types";

export interface BuilderContextValue {
  // Page / Website State
  activePage: any;
  setActivePage: (page: any) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  breakpoint: "desktop" | "tablet" | "mobile";
  setBreakpoint: (bp: "desktop" | "tablet" | "mobile") => void;

  // Theme State
  theme: ThemeTokens | null;
  setTheme: (theme: ThemeTokens) => void;

  // Engines
  historyEngine: HistoryEngine;
  clipboardEngine: ClipboardEngine;
  commandEngine: CommandEngine;
  assetEngine: AssetEngine;

  // Actions
  dispatchCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  copyNode: (nodeId: string, nodeData: any) => void;
  pasteNode: () => any | null;

  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, "id">) => void;

  // Validation / A11y Warnings
  validationErrors: ValidationError[];
  accessibilityIssues: AccessibilityIssue[];
  runAudits: () => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function useBuilderContext() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilderContext must be used within a BuilderProvider");
  return ctx;
}

export function BuilderProvider({
  initialPage = { id: "root", type: "Section", props: { children: [] } },
  initialTheme = null,
  children,
}: {
  initialPage?: any;
  initialTheme?: ThemeTokens | null;
  children: ReactNode;
}) {
  const [activePage, setActivePageState] = useState(initialPage);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [theme, setTheme] = useState<ThemeTokens | null>(initialTheme);

  // Initialize state-independent engines
  const historyEngine = useMemo(() => new HistoryEngine(), []);
  const clipboardEngine = useMemo(() => new ClipboardEngine(), []);
  const commandEngine = useMemo(() => new CommandEngine(historyEngine), [historyEngine]);
  const assetEngine = useMemo(() => new AssetEngine(), []);
  const validationEngine = useMemo(() => new ValidationEngine(), []);
  const accessibilityEngine = useMemo(() => new AccessibilityRuntime(), []);

  // Sync state items
  const [assets, setAssets] = useState<Asset[]>(assetEngine.getAssets());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);

  // Wrap state update with history recording
  const setActivePage = (next: any) => {
    setActivePageState(next);
  };

  const dispatchCommand = (command: Command) => {
    commandEngine.dispatch(activePage, command, setActivePage);
  };

  const undo = () => {
    const prevState = historyEngine.undo(activePage);
    if (prevState) setActivePageState(prevState);
  };

  const redo = () => {
    const nextState = historyEngine.redo(activePage);
    if (nextState) setActivePageState(nextState);
  };

  const copyNode = (nodeId: string, nodeData: any) => {
    clipboardEngine.copy("component", nodeId, nodeData);
  };

  const pasteNode = (): any | null => {
    const item = clipboardEngine.paste();
    if (item && item.type === "component") {
      return clipboardEngine.deepClone(item.data);
    }
    return null;
  };

  const addAsset = (asset: Omit<Asset, "id">) => {
    assetEngine.addAsset(asset);
    setAssets(assetEngine.getAssets());
  };

  const runAudits = () => {
    const vErrors: ValidationError[] = [];
    const aIssues: AccessibilityIssue[] = [];

    const traverse = (node: any) => {
      if (node && typeof node === "object") {
        if (node.id && node.type) {
          const props = node.props || {};
          vErrors.push(...validationEngine.validateNode(node.id, node.type, props));
          aIssues.push(...accessibilityEngine.auditNode(node.id, node.type, props));
        }
        if (node.props?.children) {
          if (Array.isArray(node.props.children)) {
            node.props.children.forEach(traverse);
          } else {
            traverse(node.props.children);
          }
        }
      }
    };

    traverse(activePage);
    setValidationErrors(vErrors);
    setAccessibilityIssues(aIssues);
  };

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      selectedNodeId,
      setSelectedNodeId,
      breakpoint,
      setBreakpoint,
      theme,
      setTheme,
      historyEngine,
      clipboardEngine,
      commandEngine,
      assetEngine,
      dispatchCommand,
      undo,
      redo,
      copyNode,
      pasteNode,
      assets,
      addAsset,
      validationErrors,
      accessibilityIssues,
      runAudits,
    }),
    [activePage, selectedNodeId, breakpoint, theme, assets, validationErrors, accessibilityIssues]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

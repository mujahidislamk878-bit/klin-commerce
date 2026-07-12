import React, { createContext, useContext, useState } from "react";
import { useBuilder } from "./BuilderContext";
import { CompositionEngine, LayoutMode } from "../../../runtime/resolvers/CompositionEngine";

export interface EditorCoreState {
  selectedNodeId: string | null;
  multiSelection: string[];
  hoverNodeId: string | null;
  clipboard: any | null;
  contextMenu: { x: number; y: number; nodeId: string } | null;
  dragState: any | null;
  activeBreakpoint: "desktop" | "tabletLandscape" | "tabletPortrait" | "mobileLandscape" | "mobilePortrait";
  activeTheme: string;
  activePage: string;
  layoutMode: LayoutMode;
}

export interface EditorCoreContextType {
  state: EditorCoreState;
  selectNode: (nodeId: string | null, isMulti?: boolean) => void;
  setHoverNode: (nodeId: string | null) => void;
  copyStyle: (nodeId: string) => void;
  pasteStyle: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  toggleLockNode: (nodeId: string) => void;
  toggleHideNode: (nodeId: string) => void;
  setContextMenu: (menu: { x: number; y: number; nodeId: string } | null) => void;
  setBreakpoint: (bp: "desktop" | "tabletLandscape" | "tabletPortrait" | "mobileLandscape" | "mobilePortrait") => void;
  updateProperty: (nodeId: string, path: string[], val: any, activeState?: string, activeTab?: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
}

const EditorCoreContext = createContext<EditorCoreContextType | null>(null);

export function useEditorCore() {
  const ctx = useContext(EditorCoreContext);
  if (!ctx) throw new Error("useEditorCore must be used within an EditorCoreProvider");
  return ctx;
}

function updateNestedProperty(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  const [head, ...tail] = path;
  newObj[head] = updateNestedProperty(obj[head], tail, value);
  return newObj;
}

export function EditorCoreProvider({ children }: { children: React.ReactNode }) {
  const { puckData, setPuckData, selectedNodeId, setSelectedNodeId, activePageSlug } = useBuilder();

  // Internal visual editor states
  const [multiSelection, setMultiSelection] = useState<string[]>([]);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<any | null>(null);
  const [contextMenu, setContextMenuState] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [dragState, setDragState] = useState<any | null>(null);
  const [breakpoint, setBreakpointState] = useState<EditorCoreState["activeBreakpoint"]>("desktop");
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>("safe");

  const selectNode = (nodeId: string | null, isMulti?: boolean) => {
    if (isMulti && nodeId) {
      setMultiSelection(prev => 
        prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
      );
    } else {
      setMultiSelection([]);
      setSelectedNodeId(nodeId);
    }
  };

  const setHoverNode = (nodeId: string | null) => {
    setHoverNodeId(nodeId);
  };

  const copyStyle = (nodeId: string) => {
    const target = (puckData?.content || []).find((node: any) => node.props?.id === nodeId);
    if (target) {
      const stylesToCopy = {
        width: target.props?.width,
        height: target.props?.height,
        minHeight: target.props?.minHeight,
        maxWidth: target.props?.maxWidth,
        align: target.props?.align,
        padding: target.props?.padding,
        margin: target.props?.margin,
        position: target.props?.position,
        overflow: target.props?.overflow,
        zIndex: target.props?.zIndex,
        sticky: target.props?.sticky,
        containerWidth: target.props?.containerWidth,
        bgColor: target.props?.bgColor,
        bgImage: target.props?.bgImage,
        bgType: target.props?.bgType,
        bgGradient: target.props?.bgGradient,
        borderColor: target.props?.borderColor,
        borderWidth: target.props?.borderWidth,
        borderStyle: target.props?.borderStyle,
        radius: target.props?.radius,
        shadow: target.props?.shadow,
        opacity: target.props?.opacity,
        blur: target.props?.blur,
      };
      setClipboard(stylesToCopy);
      console.log("[EditorCore] style copied:", stylesToCopy);
    }
  };

  const pasteStyle = (nodeId: string) => {
    if (!clipboard) return;
    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === nodeId) {
        return {
          ...node,
          props: { ...node.props, ...clipboard }
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
    console.log("[EditorCore] styles pasted onto:", nodeId);
  };

  const duplicateNode = (nodeId: string) => {
    const idx = (puckData?.content || []).findIndex((node: any) => node.props?.id === nodeId);
    if (idx !== -1) {
      const source = puckData.content[idx];
      const copy = {
        ...source,
        props: {
          ...source.props,
          id: `node-${Math.random().toString(36).substr(2, 9)}`,
        }
      };
      const nextContent = [...puckData.content];
      nextContent.splice(idx + 1, 0, copy);
      setPuckData({ ...puckData, content: nextContent });
    }
  };

  const deleteNode = (nodeId: string) => {
    const nextContent = (puckData?.content || []).filter((node: any) => node.props?.id !== nodeId);
    setPuckData({ ...puckData, content: nextContent });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const toggleLockNode = (nodeId: string) => {
    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === nodeId) {
        const isLocked = node.props?.locked;
        return {
          ...node,
          props: { ...node.props, locked: !isLocked }
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
  };

  const toggleHideNode = (nodeId: string) => {
    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === nodeId) {
        const isHidden = node.props?.hidden;
        return {
          ...node,
          props: { ...node.props, hidden: !isHidden }
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
  };

  const setContextMenu = (menu: { x: number; y: number; nodeId: string } | null) => {
    setContextMenuState(menu);
  };

  const setBreakpoint = (bp: EditorCoreState["activeBreakpoint"]) => {
    setBreakpointState(bp);
  };

  const updateProperty = (nodeId: string, path: string[], val: any, activeState?: string, activeTab?: string) => {
    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === nodeId) {
        // If state is Hover and style field, write to states.hover namespace
        if (activeState === "Hover" && activeTab === "Style") {
          const hoverPath = ["states", "hover", ...path];
          const nextProps = updateNestedProperty(node.props, hoverPath, val);
          return { ...node, props: nextProps };
        }
        
        const nextProps = updateNestedProperty(node.props, path, val);
        return {
          ...node,
          props: nextProps,
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    CompositionEngine.setMode(mode);
  };

  const state: EditorCoreState = {
    selectedNodeId,
    multiSelection,
    hoverNodeId,
    clipboard,
    contextMenu,
    dragState,
    activeBreakpoint: breakpoint,
    activeTheme,
    activePage: activePageSlug,
    layoutMode
  };

  const value: EditorCoreContextType = {
    state,
    selectNode,
    setHoverNode,
    copyStyle,
    pasteStyle,
    duplicateNode,
    deleteNode,
    toggleLockNode,
    toggleHideNode,
    setContextMenu,
    setBreakpoint,
    updateProperty,
    setLayoutMode
  };

  return (
    <EditorCoreContext.Provider value={value}>
      {children}
    </EditorCoreContext.Provider>
  );
}

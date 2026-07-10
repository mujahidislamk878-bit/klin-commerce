import React from "react";
import { Puck, createUsePuck } from "@measured/puck";
import { puckConfigBuilder } from "../../../lib/puck-config-builder";
import { useBuilder } from "../core/BuilderContext";
import { BuilderRuntime } from "../core/BuilderRuntime";
import { 
  Copy, 
  Trash2, 
  Lock, 
  Unlock, 
  Sparkle, 
  Bold, 
  Italic, 
  Link,
  Clipboard
} from "lucide-react";

const usePuck = createUsePuck();

function getSelectedItem(itemSelector: { index: number; zone?: string }, content: any[]): any {
  if (!itemSelector || itemSelector.index === undefined) return null;

  const zone = itemSelector.zone;
  if (!zone ||
    zone.toLowerCase().includes("root") ||
    zone.toLowerCase().includes("default") ||
    zone === "Root") {
    return content[itemSelector.index];
  }

  const findInItems = (items: any[]): any => {
    for (const item of items) {
      if (item.props) {
        for (const value of Object.values(item.props)) {
          if (value && typeof value === "object") {
            if ((value as any).zone === zone) {
              return (value as any).content?.[itemSelector.index];
            }
            if (Array.isArray(value)) {
              const found = findInItems(value);
              if (found) return found;
            }
          }
        }
      }
    }
    return null;
  };

  return findInItems(content);
}

function isPropsEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(k => {
    if (k === "id") return true;
    const valA = a[k];
    const valB = b[k];
    if (typeof valA === "object" && typeof valB === "object" && valA && valB) {
      return isPropsEqual(valA, valB);
    }
    return valA === valB;
  });
}

function isContentEqual(a: any[], b: any[]): boolean {
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return a.every((nodeA, idx) => {
    const nodeB = b[idx];
    if (!nodeB) return false;
    if (nodeA.type !== nodeB.type) return false;
    return isPropsEqual(nodeA.props, nodeB.props);
  });
}

interface PuckHelperProps {
  setPuckDispatch: React.Dispatch<React.SetStateAction<any>>;
  setPuckDataState: React.Dispatch<React.SetStateAction<any>>;
}

const PuckHelper = ({ setPuckDispatch, setPuckDataState }: PuckHelperProps) => {
  const dispatch = usePuck((state) => state.dispatch);
  const appState = usePuck((state) => state.appState);

  React.useEffect(() => {
    console.log("[PuckHelper] mounted, dispatch and data sync established.");
    setPuckDispatch(() => dispatch);
  }, [dispatch, setPuckDispatch]);

  React.useEffect(() => {
    setPuckDataState(appState.data);
  }, [appState.data, setPuckDataState]);

  return null;
};

export function BuilderCanvas({ puckData, onChange }: { puckData: any; onChange: (next: any) => void }) {
  const { setSelectedNodeId, selectedNodeId, setPuckData } = useBuilder();
  const [puckDispatch, setPuckDispatch] = React.useState<any>(null);
  const [puckDataState, setPuckDataState] = React.useState<any>(null);
  const isInternalChangeRef = React.useRef(false);

  // Context Menu state
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; nodeId: string } | null>(null);
  // Style Clipboard state
  const [styleClipboard, setStyleClipboard] = React.useState<any>(null);
  // Text Selection Mini-Toolbar state
  const [textToolbar, setTextToolbar] = React.useState<{ x: number; y: number; text: string } | null>(null);

  const overrides = React.useMemo(() => ({
    header: () => <PuckHelper setPuckDispatch={setPuckDispatch} setPuckDataState={setPuckDataState} />,
    headerActions: () => <></>,
    drawer: () => <></>,
    actionBar: () => <></>,
  }), [setPuckDispatch, setPuckDataState]);

  // Sync outer data updates (e.g. from inspector or outer actions) back to Puck (debounced to group history entries)
  React.useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    if (puckDispatch && puckData && puckDataState) {
      if (!isContentEqual(puckData.content, puckDataState.content)) {
        const handler = setTimeout(() => {
          puckDispatch({ type: "setData", data: puckData });
        }, 400);
        return () => clearTimeout(handler);
      }
    }
  }, [puckData, puckDispatch, puckDataState]);

  // Sync selection from context back to Puck
  React.useEffect(() => {
    if (!puckDispatch || !puckData?.content) return;

    if (selectedNodeId) {
      const index = puckData.content.findIndex((node: any) => node.props?.id === selectedNodeId);
      if (index !== -1) {
        puckDispatch({
          type: "setUi",
          ui: {
            itemSelector: { index, zone: "Root" }
          }
        });
      }
    } else {
      puckDispatch({
        type: "setUi",
        ui: {
          itemSelector: null
        }
      });
    }
  }, [selectedNodeId, puckDispatch, puckData]);

  // Register Context Menu & Selection formatting events inside the sandboxed iframe
  React.useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          clearInterval(interval);
          console.log("[CanvasEvents] Iframe target document listener attached.");

          // Right click context menu
          doc.addEventListener("contextmenu", (e: MouseEvent) => {
            const targetEl = e.target as HTMLElement;
            const compEl = targetEl.closest("[data-puck-component], [data-testid='preview-component'], .Puck-Component");
            if (compEl) {
              e.preventDefault();
              const iframeRect = iframe.getBoundingClientRect();
              const x = e.clientX + iframeRect.left;
              const y = e.clientY + iframeRect.top;

              const componentEls = Array.from(doc.querySelectorAll("[data-puck-component], [data-testid='preview-component'], .Puck-Component"));
              const index = componentEls.indexOf(compEl);
              if (index !== -1 && puckData.content[index]) {
                const nodeId = puckData.content[index].props?.id;
                setContextMenu({ x, y, nodeId });
              }
            }
          });

          // Text selection floating format toolbar
          doc.addEventListener("selectionchange", () => {
            const selection = doc.getSelection();
            if (selection && selection.toString().trim().length > 0) {
              try {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const iframeRect = iframe.getBoundingClientRect();
                setTextToolbar({
                  x: rect.left + iframeRect.left + rect.width / 2,
                  y: rect.top + iframeRect.top - 44,
                  text: selection.toString()
                });
              } catch (err) {
                // Ignore selection error
              }
            } else {
              setTextToolbar(null);
            }
          });

          // Close context menu on canvas click
          doc.addEventListener("click", () => {
            setContextMenu(null);
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [puckData, setContextMenu, setTextToolbar]);

  // Close context menu on parent window click
  React.useEffect(() => {
    const handleClose = () => {
      setContextMenu(null);
    };
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const dragData = JSON.parse(dataStr);
      const type = dragData.type || dragData.component;
      if (!type) return;

      const canvasEl = e.currentTarget;

      const iframe = canvasEl.querySelector("iframe");
      const targetDocument = iframe ? iframe.contentDocument || iframe.contentWindow?.document : document;
      const iframeRect = iframe ? iframe.getBoundingClientRect() : { top: 0, left: 0 };

      const componentEls = targetDocument
        ? Array.from(targetDocument.querySelectorAll("[data-puck-component], [data-testid='preview-component'], .Puck-Component"))
        : [];

      let dropIndex = puckData.content.length;
      const mouseY = e.clientY;

      for (let i = 0; i < componentEls.length; i++) {
        const rect = componentEls[i].getBoundingClientRect();
        const elementTop = rect.top + iframeRect.top;
        const middleY = elementTop + rect.height / 2;
        if (mouseY < middleY) {
          dropIndex = i;
          break;
        }
      }

      const nextContent = [...(puckData?.content || [])];
      const newId = `${type.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
      const newNode = {
        id: newId,
        type,
        props: {
          id: newId
        }
      };

      if (dropIndex >= 0 && dropIndex <= nextContent.length) {
        nextContent.splice(dropIndex, 0, newNode);
      } else {
        nextContent.push(newNode);
      }

      const nextData = { ...puckData, content: nextContent };

      if (puckDispatch) {
        puckDispatch({ type: "setData", data: nextData });
      }
      onChange(nextData);
      setSelectedNodeId(newId);
    } catch (err) {
      console.error("Drop handling failed", err);
    }
  };

  // Context Menu triggers
  const handleDuplicateNode = (nodeId: string) => {
    const idx = puckData.content.findIndex((node: any) => node.props?.id === nodeId);
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
      const nextData = { ...puckData, content: nextContent };
      setPuckData(nextData);
      onChange(nextData);
    }
  };

  const handleLockToggleNode = (nodeId: string) => {
    const nextContent = puckData.content.map((node: any) => {
      if (node.props?.id === nodeId) {
        const isLocked = node.props?.locked;
        return {
          ...node,
          props: { ...node.props, locked: !isLocked }
        };
      }
      return node;
    });
    const nextData = { ...puckData, content: nextContent };
    setPuckData(nextData);
    onChange(nextData);
  };

  const handleCopyStyleNode = (nodeId: string) => {
    const target = puckData.content.find((node: any) => node.props?.id === nodeId);
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
      setStyleClipboard(stylesToCopy);
    }
  };

  const handlePasteStyleNode = (nodeId: string) => {
    if (!styleClipboard) return;
    const nextContent = puckData.content.map((node: any) => {
      if (node.props?.id === nodeId) {
        return {
          ...node,
          props: {
            ...node.props,
            ...styleClipboard,
          }
        };
      }
      return node;
    });
    const nextData = { ...puckData, content: nextContent };
    setPuckData(nextData);
    onChange(nextData);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nextContent = puckData.content.filter((node: any) => node.props?.id !== nodeId);
    const nextData = { ...puckData, content: nextContent };
    setPuckData(nextData);
    onChange(nextData);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const triggerAISuggestionFormat = () => {
    alert(`[AI Smart Suggestion] Improve selected text "${textToolbar?.text.substring(0, 15)}...": Replace with a benefit-oriented heading, e.g. 'Unlock Simple Wardrobes'`);
  };

  return (
    <div
      className="w-full h-full custom-puck-editor relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Puck
        data={puckData}
        onChange={(nextData) => {
          isInternalChangeRef.current = true;
          onChange(nextData);
        }}
        config={puckConfigBuilder as any}
        ui={{
          leftSideBarVisible: false,
          rightSideBarVisible: false
        }}
        onAction={(action, appState) => {
          const itemSelector = appState.ui?.itemSelector;
          if (itemSelector) {
            const selectedItem = (appState as any).selectedItem || getSelectedItem(itemSelector, puckData.content);
            const nextSelectedId = selectedItem?.props?.id || selectedItem?.id || null;
            if (nextSelectedId !== selectedNodeId) {
              setSelectedNodeId(nextSelectedId);
            }
          } else if (selectedNodeId !== null) {
            setSelectedNodeId(null);
          }
        }}
        overrides={overrides}
      />

      {/* Floating Canvas Context Menu */}
      {contextMenu && (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="absolute z-50 bg-[#0F1020] text-white p-2.5 rounded-xl shadow-2xl border border-white/10 flex flex-col min-w-[140px] text-xs font-semibold select-none divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="py-1">
            <button 
              onClick={() => { handleDuplicateNode(contextMenu.nodeId); setContextMenu(null); }}
              className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 rounded-lg flex items-center gap-2"
            >
              <Copy className="h-3 w-3" /> Duplicate
            </button>
            <button 
              onClick={() => { handleLockToggleNode(contextMenu.nodeId); setContextMenu(null); }}
              className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 rounded-lg flex items-center gap-2"
            >
              <Lock className="h-3 w-3 text-red-400" /> Lock / Unlock
            </button>
          </div>
          
          <div className="py-1">
            <button 
              onClick={() => { handleCopyStyleNode(contextMenu.nodeId); setContextMenu(null); }}
              className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 rounded-lg flex items-center gap-2"
            >
              <Copy className="h-3 w-3" /> Copy Style
            </button>
            <button 
              disabled={!styleClipboard}
              onClick={() => { handlePasteStyleNode(contextMenu.nodeId); setContextMenu(null); }}
              className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 rounded-lg flex items-center gap-2 disabled:opacity-40"
            >
              <Clipboard className="h-3 w-3" /> Paste Style
            </button>
          </div>

          <div className="py-1">
            <button 
              onClick={() => { handleDeleteNode(contextMenu.nodeId); setContextMenu(null); }}
              className="w-full text-left px-2.5 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Floating Canvas Inline Mini-Toolbar Selection */}
      {textToolbar && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ left: textToolbar.x, top: textToolbar.y }}
          className="-translate-x-1/2 absolute z-50 bg-[#0F1020] text-white p-1 rounded-xl shadow-xl border border-white/10 flex items-center gap-1 text-[10px] font-bold select-none divide-x divide-white/10"
        >
          <div className="flex gap-0.5 px-1">
            <button className="p-1 hover:bg-white/15 rounded text-neutral-300 hover:text-white transition">
              <Bold className="h-3 w-3" />
            </button>
            <button className="p-1 hover:bg-white/15 rounded text-neutral-300 hover:text-white transition">
              <Italic className="h-3 w-3" />
            </button>
            <button className="p-1 hover:bg-white/15 rounded text-neutral-300 hover:text-white transition">
              <Link className="h-3 w-3" />
            </button>
          </div>
          
          <button 
            onClick={triggerAISuggestionFormat}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/15 rounded-lg text-indigo-300 hover:text-indigo-200 transition font-sans select-none ml-1"
          >
            <Sparkle className="h-3 w-3 text-indigo-400" /> AI Rewrite
          </button>
        </div>
      )}
    </div>
  );
}

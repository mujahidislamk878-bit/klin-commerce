"use client";

export interface ClipboardItem {
  type: "component" | "style";
  componentId?: string;
  data: any;
  metadata?: any;
}

export class ClipboardEngine {
  private storageKey = "klin_builder_clipboard";

  public copy(type: "component" | "style", componentId: string | undefined, data: any, metadata?: any) {
    const item: ClipboardItem = {
      type,
      componentId,
      data: JSON.parse(JSON.stringify(data)),
      metadata,
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(item));
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  }

  public paste(): ClipboardItem | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // ponytail: deep clone copies nodes with new IDs to prevent key clashes
  public deepClone(data: any): any {
    if (!data) return null;
    const cloned = JSON.parse(JSON.stringify(data));
    const reassignIds = (node: any) => {
      if (node && typeof node === "object") {
        if (node.id) {
          node.id = `${node.type}_${Math.random().toString(36).substring(7)}`;
        }
        if (node.props && node.props.children) {
          if (Array.isArray(node.props.children)) {
            node.props.children.forEach(reassignIds);
          } else {
            reassignIds(node.props.children);
          }
        }
      }
    };
    reassignIds(cloned);
    return cloned;
  }
}

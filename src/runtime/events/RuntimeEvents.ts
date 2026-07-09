export type RuntimeEventType =
  | "Render Started"
  | "Render Finished"
  | "Snapshot Created"
  | "Theme Changed"
  | "Asset Changed"
  | "Page Changed"
  | "Cache Cleared";

type RuntimeEventListener = (payload?: any) => void;

export class RuntimeEvents {
  private static listeners: Map<RuntimeEventType, Set<RuntimeEventListener>> = new Map();

  public static on(event: RuntimeEventType, callback: RuntimeEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return an unsubscribe helper
    return () => this.off(event, callback);
  }

  public static off(event: RuntimeEventType, callback: RuntimeEventListener) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  public static emit(event: RuntimeEventType, payload?: any) {
    console.log(`[EVENT EMITTED] ${event}`, payload);
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => {
        try {
          callback(payload);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

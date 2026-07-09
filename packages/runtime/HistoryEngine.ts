"use client";

export interface HistorySnapshot {
  id: string;
  timestamp: number;
  label?: string;
  data: any; // Serialized builder tree state
}

export class HistoryEngine {
  private past: HistorySnapshot[] = [];
  private future: HistorySnapshot[] = [];
  private maxLimit = 50;

  constructor(limit = 50) {
    this.maxLimit = limit;
  }

  public record(currentState: any, label?: string) {
    if (!currentState) return;
    
    // History Compression: only push if data changes
    const serialized = JSON.stringify(currentState);
    if (this.past.length > 0 && JSON.stringify(this.past[this.past.length - 1].data) === serialized) {
      return;
    }

    this.past.push({
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      label,
      data: JSON.parse(serialized),
    });

    if (this.past.length > this.maxLimit) {
      this.past.shift(); // Evict oldest
    }
    this.future = []; // Clear redo stack on new action
  }

  public undo(currentState: any): any | null {
    if (this.past.length === 0) return null;
    
    const previous = this.past.pop()!;
    this.future.unshift({
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      label: previous.label,
      data: JSON.parse(JSON.stringify(currentState)),
    });
    
    return previous.data;
  }

  public redo(currentState: any): any | null {
    if (this.future.length === 0) return null;
    
    const next = this.future.shift()!;
    this.past.push({
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      label: next.label,
      data: JSON.parse(JSON.stringify(currentState)),
    });
    
    return next.data;
  }

  public getHistory(): HistorySnapshot[] {
    return [...this.past];
  }

  public restore(snapshotId: string): any | null {
    const matched = this.past.find((s) => s.id === snapshotId);
    return matched ? matched.data : null;
  }
}

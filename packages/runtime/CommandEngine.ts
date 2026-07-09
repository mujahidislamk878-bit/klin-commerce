"use client";

import type { HistoryEngine } from "./HistoryEngine";

export interface Command {
  execute: (state: any) => any;
  undo: (state: any) => any;
  label: string;
}

export class CommandEngine {
  private history: HistoryEngine;

  constructor(historyEngine: HistoryEngine) {
    this.history = historyEngine;
  }

  public dispatch(state: any, command: Command, updateState: (newState: any) => void) {
    // Record current snapshot before applying command
    this.history.record(state, command.label);
    
    // Execute command and update state
    const nextState = command.execute(state);
    updateState(nextState);
  }
}

// Reusable commands
export const changePropertyCommand = (nodeId: string, propertyKey: string, value: any): Command => ({
  label: `Change Prop: ${propertyKey}`,
  execute: (state: any) => {
    const next = JSON.parse(JSON.stringify(state));
    const findAndSet = (node: any) => {
      if (node.id === nodeId) {
        node.props = { ...node.props, [propertyKey]: value };
        return true;
      }
      if (node.props?.children) {
        if (Array.isArray(node.props.children)) {
          for (const c of node.props.children) {
            if (findAndSet(c)) return true;
          }
        } else {
          return findAndSet(node.props.children);
        }
      }
      return false;
    };
    findAndSet(next);
    return next;
  },
  undo: (state: any) => state, // History handles undo snapshots
});

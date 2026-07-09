const undoStack: any[] = [];
const redoStack: any[] = [];

export const HistoryService = {
  push(state: any) {
    undoStack.push(JSON.parse(JSON.stringify(state)));
    redoStack.length = 0;
  },

  undo(currentState: any, setPuckData: (next: any) => void) {
    if (undoStack.length === 0) return;
    const previous = undoStack.pop();
    redoStack.push(JSON.parse(JSON.stringify(currentState)));
    setPuckData(previous);
  },

  redo(currentState: any, setPuckData: (next: any) => void) {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    undoStack.push(JSON.parse(JSON.stringify(currentState)));
    setPuckData(next);
  }
};

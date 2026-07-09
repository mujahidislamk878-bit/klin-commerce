import React, { createContext, useContext } from "react";
import { RenderContext, createRenderContext } from "./RenderContext";

const RuntimeRenderContext = createContext<RenderContext>(createRenderContext({}));

export interface RuntimeProviderProps {
  context: RenderContext;
  children: React.ReactNode;
}

export function RuntimeProvider({ context, children }: RuntimeProviderProps) {
  return (
    <RuntimeRenderContext.Provider value={context}>
      {children}
    </RuntimeRenderContext.Provider>
  );
}

export function useRenderContext(): RenderContext {
  const context = useContext(RuntimeRenderContext);
  if (!context) {
    throw new Error("useRenderContext must be used within a RuntimeProvider");
  }
  return context;
}

import React from "react";
import { BuilderProvider, BuilderContextType } from "./BuilderContext";
import { BuilderToolbar } from "../toolbar/BuilderToolbar";
import { BuilderSidebar } from "../sidebar/BuilderSidebar";
import { BuilderCanvas } from "../canvas/BuilderCanvas";
import { CanvasFrame } from "../canvas/CanvasFrame";
import { CanvasOverlay } from "../canvas/CanvasOverlay";
import { CanvasGuides } from "../canvas/CanvasGuides";
import { CanvasRulers } from "../canvas/CanvasRulers";
import { PropertyInspector } from "../inspector/PropertyInspector";
import { BuilderStatusBar } from "../status/BuilderStatusBar";
import { FloatingToolbar } from "../toolbar/FloatingToolbar";
import { CanvasRuntime } from "../runtime/CanvasRuntime";

interface BuilderShellProps {
  contextValue: BuilderContextType;
  onPublish?: () => void;
  onSaveAsTemplate?: () => void;
  onSaveDirectly?: () => void;
  onOpenSiteManager?: () => void;
  onAddPage?: () => void;
  onDeletePage?: (slug: string) => void;
  isTemplate?: boolean;
}

export function BuilderShell({
  contextValue,
  onPublish,
  onSaveAsTemplate,
  onSaveDirectly,
  onOpenSiteManager,
  onAddPage,
  onDeletePage,
  isTemplate = false
}: BuilderShellProps) {
  const width = CanvasRuntime.getDeviceWidth(contextValue.device);

  return (
    <BuilderProvider value={contextValue}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#EEF0F5] font-sans">
        <BuilderToolbar
          onPublish={onPublish}
          onSaveAsTemplate={onSaveAsTemplate}
          onSaveDirectly={onSaveDirectly}
          onOpenSiteManager={onOpenSiteManager}
          isTemplate={isTemplate}
          savingState={contextValue.saving}
        />

        <div className="flex-1 flex overflow-hidden relative bg-[#EEF0F5]">
          <BuilderSidebar
            onAddPage={onAddPage || (() => {})}
            onDeletePage={onDeletePage || (() => {})}
          />

          <div className="flex-1 flex flex-col overflow-hidden relative">
            <CanvasRulers />
            
            <CanvasOverlay>
              <CanvasFrame width={width}>
                <BuilderCanvas
                  puckData={contextValue.puckData}
                  onChange={contextValue.setPuckData}
                />
              </CanvasFrame>
              <CanvasGuides />
            </CanvasOverlay>

            <FloatingToolbar />
          </div>

          <PropertyInspector />
        </div>

        <BuilderStatusBar />
      </div>
    </BuilderProvider>
  );
}

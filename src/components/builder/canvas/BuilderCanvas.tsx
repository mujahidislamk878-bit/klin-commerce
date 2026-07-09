import React from "react";
import { Puck } from "@measured/puck";
import { puckConfigBuilder } from "../../../lib/puck-config-builder";

export function BuilderCanvas({ puckData, onChange }: { puckData: any; onChange: (next: any) => void }) {
  return (
    <div className="w-full h-full custom-puck-editor relative">
      <Puck
        data={puckData}
        onChange={onChange}
        config={puckConfigBuilder as any}
        ui={{
          leftSideBarVisible: false,
          rightSideBarVisible: false
        }}
        overrides={{
          header: () => <></>,
          headerActions: () => <></>,
          components: () => <></>,
        }}
      />
    </div>
  );
}

import { BuilderRuntime } from "../core/BuilderRuntime";

export const BuilderSDK = {
  getVersion(): string {
    return "3.6.0-enterprise";
  },
  
  getComponentList(ctx: any) {
    return ctx.puckData?.content || [];
  },

  updateProps(id: string, props: any, ctx: any) {
    BuilderRuntime.updateComponentProps(id, props, ctx);
  }
};

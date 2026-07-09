import { BuilderAdapter } from "./BuilderAdapter";

export const BuilderRuntime = {
  // Page Actions
  changePage(slug: string, ctx: any) {
    ctx.setActivePageSlug(slug);
    const page = ctx.pages.find((p: any) => p.slug === slug);
    if (page?.builderJson) {
      ctx.setPuckData(page.builderJson);
    }
  },

  // Component Actions
  insertComponent(type: string, index: number, ctx: any) {
    BuilderAdapter.insertNode(type, index, ctx.puckData, (next) => {
      ctx.setPuckData(next);
      const newId = next.content[index]?.props?.id;
      if (newId) ctx.setSelectedNodeId(newId);
    });
  },

  updateComponentProps(id: string, props: any, ctx: any) {
    BuilderAdapter.updateProps(id, props, ctx.puckData, ctx.setPuckData);
  },

  deleteComponent(id: string, ctx: any) {
    BuilderAdapter.deleteNode(id, ctx.puckData, ctx.setPuckData);
    if (ctx.selectedNodeId === id) ctx.setSelectedNodeId(null);
  },

  duplicateComponent(id: string, ctx: any) {
    BuilderAdapter.duplicateNode(id, ctx.puckData, ctx.setPuckData);
  },

  moveComponent(source: number, destination: number, ctx: any) {
    BuilderAdapter.moveNode(source, destination, ctx.puckData, ctx.setPuckData);
  }
};

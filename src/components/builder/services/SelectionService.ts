export const SelectionService = {
  select(id: string | null, ctx: any) {
    ctx.setSelectedNodeId(id);
  },
  getSelectedNode(ctx: any) {
    if (!ctx.selectedNodeId) return null;
    return (ctx.puckData?.content || []).find((node: any) => node.props?.id === ctx.selectedNodeId);
  }
};

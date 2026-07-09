let localClipboardNode: any = null;

export const ClipboardService = {
  copy(node: any) {
    if (!node) return;
    localClipboardNode = JSON.parse(JSON.stringify(node));
  },
  
  paste(ctx: any) {
    if (!localClipboardNode) return;
    const nextContent = [...(ctx.puckData?.content || [])];
    const newId = `${localClipboardNode.type.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    const duplicate = JSON.parse(JSON.stringify(localClipboardNode));
    duplicate.props.id = newId;

    nextContent.push(duplicate);
    ctx.setPuckData({ ...ctx.puckData, content: nextContent });
    ctx.setSelectedNodeId(newId);
  },

  duplicate(node: any, ctx: any) {
    if (!node) return;
    this.copy(node);
    this.paste(ctx);
  }
};

export const NodeRuntime = {
  findNodeById(id: string, content: any[]): any | null {
    return content.find((node) => node.props?.id === id) || null;
  },
  
  createNode(type: string, props: any = {}): any {
    const randomId = `${type.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      type,
      props: {
        id: randomId,
        ...props
      }
    };
  }
};

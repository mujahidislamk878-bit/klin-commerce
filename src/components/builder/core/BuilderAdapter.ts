export interface BuilderTree {
  content: any[];
  root: Record<string, any>;
}

export interface BuilderSelection {
  selectedId: string | null;
}

export interface IBuilderAdapter {
  getTree(data: any): BuilderTree;
  updateProps(id: string, props: any, data: any, onChange: (next: any) => void): void;
  deleteNode(id: string, data: any, onChange: (next: any) => void): void;
  duplicateNode(id: string, data: any, onChange: (next: any) => void): void;
  insertNode(type: string, index: number, data: any, onChange: (next: any) => void): void;
  moveNode(sourceIndex: number, destinationIndex: number, data: any, onChange: (next: any) => void): void;
}

export const BuilderAdapter: IBuilderAdapter = {
  getTree(data: any): BuilderTree {
    return {
      content: data?.content || [],
      root: data?.root || {}
    };
  },

  updateProps(id: string, props: any, data: any, onChange: (next: any) => void): void {
    const nextContent = (data?.content || []).map((node: any) => {
      if (node.props?.id === id) {
        return { ...node, props: { ...node.props, ...props } };
      }
      return node;
    });
    onChange({ ...data, content: nextContent });
  },

  deleteNode(id: string, data: any, onChange: (next: any) => void): void {
    const nextContent = (data?.content || []).filter((node: any) => node.props?.id !== id);
    onChange({ ...data, content: nextContent });
  },

  duplicateNode(id: string, data: any, onChange: (next: any) => void): void {
    const nextContent = [...(data?.content || [])];
    const index = nextContent.findIndex((node: any) => node.props?.id === id);
    if (index === -1) return;

    const source = nextContent[index];
    const newId = `${source.type.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    const duplicate = JSON.parse(JSON.stringify(source));
    duplicate.props.id = newId;

    nextContent.splice(index + 1, 0, duplicate);
    onChange({ ...data, content: nextContent });
  },

  insertNode(type: string, index: number, data: any, onChange: (next: any) => void): void {
    const nextContent = [...(data?.content || [])];
    const newId = `${type.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    const newNode = {
      type,
      props: {
        id: newId
      }
    };
    
    if (index >= 0 && index <= nextContent.length) {
      nextContent.splice(index, 0, newNode);
    } else {
      nextContent.push(newNode);
    }
    onChange({ ...data, content: nextContent });
  },

  moveNode(sourceIndex: number, destinationIndex: number, data: any, onChange: (next: any) => void): void {
    const nextContent = [...(data?.content || [])];
    const [moved] = nextContent.splice(sourceIndex, 1);
    nextContent.splice(destinationIndex, 0, moved);
    onChange({ ...data, content: nextContent });
  }
};

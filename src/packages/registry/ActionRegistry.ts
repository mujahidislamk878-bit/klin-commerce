export interface BuilderAction {
  id: string;
  name: string;
  description: string;
}

export const ActionRegistry = {
  getActions(): BuilderAction[] {
    return [
      { id: "navigate", name: "Navigate to Link", description: "Transitions site to a specified page URL path." },
      { id: "add_to_cart", name: "Add to Shopping Cart", description: "Appends the catalog item directly to checkout." },
      { id: "open_modal", name: "Open Visual Popup Dialog", description: "Mounts an overlay containing dynamic widgets." }
    ];
  }
};

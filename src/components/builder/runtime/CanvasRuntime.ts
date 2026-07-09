export const CanvasRuntime = {
  calculateViewportScale(_device: "desktop" | "tablet" | "mobile", zoom: number): number {
    return zoom / 100;
  },

  getDeviceWidth(device: "desktop" | "tablet" | "mobile"): string {
    switch (device) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  }
};

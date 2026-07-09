export interface AnimationProfile {
  id: string;
  name: string;
  className: string;
}

export const AnimationRegistry = {
  getAnimations(): AnimationProfile[] {
    return [
      { id: "fade", name: "Fade In", className: "animate-fade-in" },
      { id: "slide-up", name: "Slide Up", className: "animate-slide-up" },
      { id: "zoom-in", name: "Zoom In", className: "animate-zoom-in" },
      { id: "bounce", name: "Bounce Highlight", className: "animate-bounce" }
    ];
  }
};

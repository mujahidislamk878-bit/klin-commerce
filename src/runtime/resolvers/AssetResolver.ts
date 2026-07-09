import { RenderContext } from "../core/RenderContext";

export class AssetResolver {
  public static resolve(context: RenderContext): RenderContext {
    const layout = JSON.parse(JSON.stringify(context.page.layout || { content: [], root: {} }));

    const getOptimizedUrl = (url: string, type: string) => {
      if (!url) return "";
      if (url.includes("placeholder") || url.startsWith("https://placehold.co")) {
        return url;
      }
      
      // Simulating WebP/AVIF responsive size compiler (Cloudinary style URL transformations)
      if (url.includes("cloudinary.com")) {
        const format = context.device === "Mobile" ? "w_400,c_limit,f_auto,q_auto" : "w_1200,f_auto,q_auto";
        return url.replace("/upload/", `/upload/${format}/`);
      }
      
      return url;
    };

    const traverse = (obj: any): any => {
      if (obj !== null && typeof obj === "object") {
        if (obj.type === "Image" && obj.props?.src) {
          obj.props.src = getOptimizedUrl(obj.props.src, "image");
          obj.props.loading = "lazy";
        }
        if (obj.type === "Video" && obj.props?.src) {
          obj.props.src = getOptimizedUrl(obj.props.src, "video");
        }
        
        Object.keys(obj).forEach((key) => {
          obj[key] = traverse(obj[key]);
        });
      }
      return obj;
    };

    if (layout.content) {
      layout.content = traverse(layout.content);
    }

    return {
      ...context,
      page: {
        ...context.page,
        layout,
      }
    };
  }
}
export default AssetResolver;

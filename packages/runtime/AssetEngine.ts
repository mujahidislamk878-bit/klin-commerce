"use client";

export interface Asset {
  id: string;
  url: string;
  name: string;
  type: "image" | "video" | "svg" | "document";
  tags?: string[];
  altText?: string;
  sizeBytes?: number;
}

export class AssetEngine {
  private assets: Asset[] = [
    { id: "1", url: "https://placehold.co/600x400", name: "Default Banner", type: "image", tags: ["banner", "placeholder"] },
  ];

  public getAssets(search = "", tag = ""): Asset[] {
    return this.assets.filter((asset) => {
      const matchSearch = asset.name.toLowerCase().includes(search.toLowerCase());
      const matchTag = tag ? asset.tags?.includes(tag) : true;
      return matchSearch && matchTag;
    });
  }

  public addAsset(asset: Omit<Asset, "id">): Asset {
    const newAsset: Asset = {
      ...asset,
      id: Math.random().toString(36).substring(7),
    };
    this.assets.push(newAsset);
    return newAsset;
  }

  public deleteAsset(id: string) {
    this.assets = this.assets.filter((a) => a.id !== id);
  }
}

export const assetEngine = new AssetEngine();

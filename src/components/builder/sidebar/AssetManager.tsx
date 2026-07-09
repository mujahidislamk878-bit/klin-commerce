import React, { useState } from "react";
import { AssetService } from "../services/AssetService";
import { Upload, Trash2 } from "lucide-react";

export function AssetManager() {
  const [assets, setAssets] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const url = await AssetService.upload(e.target.files[0], "");
      setAssets((prev) => [...prev, url]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/45 font-bold">Asset Manager</h3>
        <p className="text-[10px] text-[#0F1020]/50 mt-0.5">Upload and drag media files onto your layout blocks.</p>
      </div>

      <label className="border border-dashed border-black/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-50 transition">
        <Upload className="h-5 w-5 text-[#0F1020]/40 mb-2" />
        <span className="text-[10px] font-bold text-[#0F1020]/80">
          {uploading ? "Uploading media file..." : "Drag files here or click to browse"}
        </span>
        <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
      </label>

      <div className="grid grid-cols-3 gap-2">
        {assets.map((asset, idx) => (
          <div key={idx} className="relative aspect-square border border-black/5 rounded-xl overflow-hidden group bg-neutral-50 flex items-center justify-center">
            <img src={asset} alt="asset" className="w-full h-full object-cover" />
            <button
              onClick={() => setAssets(assets.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 p-1 bg-white hover:bg-red-500 hover:text-white rounded-lg shadow-sm text-red-500 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

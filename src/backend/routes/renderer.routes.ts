import { Router, Response, Request } from "express";
import { getDatabase } from "../db";

const router = Router();

// Public endpoint (no token required) to resolve site configuration for visitors
// GET /api/sites/resolve/:subdomain
router.get("/sites/resolve/:subdomain", async (req: Request, res: Response) => {
  try {
    const subdomain = req.params.subdomain;
    const db = await getDatabase();

    // Query by subdomain or customDomain
    let website = await db.collection("websites").findOne({
      $or: [
        { "settings.subdomain": subdomain },
        { "settings.customDomain": subdomain }
      ]
    });

    if (!website) {
      return res.status(404).json({ success: false, error: `Website matching domain/subdomain '${subdomain}' not found.` });
    }

    // Try to get the latest published snapshot
    const latestSnapshot = await db.collection("website_snapshots")
      .find({ websiteId: website.websiteId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    let outputData = {
      websiteId: website.websiteId,
      name: website.name,
      metadata: website.metadata || {},
      theme: website.theme || {},
      navigation: website.navigation || [],
      pages: website.pages || [],
      settings: website.settings || {},
      seo: website.seo || {},
      isLiveSnapshot: false,
      snapshotId: null as string | null
    };

    if (latestSnapshot && latestSnapshot.length > 0) {
      const snap = latestSnapshot[0];
      outputData.pages = snap.pages || [];
      outputData.theme = snap.theme || {};
      outputData.navigation = snap.navigation || [];
      outputData.seo = snap.seo || {};
      outputData.settings = snap.settings || {};
      outputData.isLiveSnapshot = true;
      outputData.snapshotId = snap.snapshotId;
    }

    res.json({ success: true, siteData: outputData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to resolve website rendering data" });
  }
});

// GET /api/sites/export/:id (simulate exporting static structure)
router.get("/sites/export/:id", async (req: Request, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    const website = await db.collection("websites").findOne({ websiteId });
    if (!website) return res.status(404).json({ success: false, error: "Website not found" });

    // Mock static output file structure zip or JSON format
    const manifest = {
      name: website.name,
      short_name: website.name,
      start_url: "/",
      display: "standalone",
      background_color: website.theme?.colors?.background || "#ffffff",
      theme_color: website.theme?.colors?.primary || "#0F1020",
    };

    const assetManifest = {
      files: {
        "main.js": "/assets/main.js",
        "main.css": "/assets/main.css",
        "index.html": "/index.html",
      },
      images: ["/images/logo.png"],
      videos: [],
      fonts: ["/fonts/inter.woff2"],
    };

    res.json({
      success: true,
      files: {
        "index.html": `<!DOCTYPE html><html><head><title>${website.seo?.title || website.name}</title></head><body><div id="root"></div></body></html>`,
        "manifest.json": JSON.stringify(manifest, null, 2),
        "asset-manifest.json": JSON.stringify(assetManifest, null, 2),
        "robots.txt": "User-agent: *\nAllow: /",
        "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>http://${website.settings?.subdomain}.klin.store/</loc></url></urlset>`,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to generate static build export" });
  }
});

export default router;

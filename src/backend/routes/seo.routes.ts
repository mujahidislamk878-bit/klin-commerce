import { Router, Response, Request } from "express";
import { getDatabase } from "../db";

const router = Router();

// GET /site/:subdomain/sitemap.xml
router.get("/site/:subdomain/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const subdomain = req.params.subdomain;
    const db = await getDatabase();
    const website = await db.collection("websites").findOne({
      $or: [
        { "settings.subdomain": subdomain },
        { "settings.customDomain": subdomain }
      ]
    });

    if (!website) {
      return res.status(404).send("Website not found");
    }

    const pages = website.pages || [];
    const siteUrl = `http://${website.settings?.subdomain || "preview"}.klin.store`;

    const urls = pages.map((page: any) => {
      return `  <url>
    <loc>${siteUrl}/${page.slug === "home" ? "" : page.slug}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.slug === "home" ? "1.0" : "0.7"}</priority>
  </url>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (e: any) {
    res.status(500).send("Internal Server Error: " + e.message);
  }
});

// GET /site/:subdomain/robots.txt
router.get("/site/:subdomain/robots.txt", async (req: Request, res: Response) => {
  try {
    const subdomain = req.params.subdomain;
    const db = await getDatabase();
    const website = await db.collection("websites").findOne({
      $or: [
        { "settings.subdomain": subdomain },
        { "settings.customDomain": subdomain }
      ]
    });

    if (!website) {
      return res.status(404).send("Website not found");
    }

    const sitemapUrl = `http://${website.settings?.subdomain || "preview"}.klin.store/sitemap.xml`;
    const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`;

    res.set("Content-Type", "text/plain");
    res.send(robots);
  } catch (e: any) {
    res.status(500).send("Internal Server Error: " + e.message);
  }
});

export default router;

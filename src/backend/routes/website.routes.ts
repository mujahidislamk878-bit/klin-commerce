import { Router, Response } from "express";
import { getDatabase } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { logWebsiteActivity } from "../services/activity.service";

const router = Router();

// GET /api/dashboard/websites
router.get("/dashboard/websites", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const db = await getDatabase();
    const websites = await db.collection("websites").find({ userId }).toArray();
    res.json({ success: true, websites });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch websites" });
  }
});

// GET /api/websites/:id
router.get("/websites/:id", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    const website = await db.collection("websites").findOne({ websiteId });
    if (!website) return res.status(404).json({ success: false, error: "Website not found" });
    res.json({ success: true, website });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to retrieve website details" });
  }
});

// POST /api/websites/wizard-create
router.post("/websites/wizard-create", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userEmail = req.user?.email || "anonymous";
    const {
      templateId,
      businessName,
      websiteName,
      subdomain,
      industry,
      currency,
      language,
      timezone,
      themeStyle = "modern",
      primaryColor = "#0F1020",
      logo = "",
      favicon = "",
    } = req.body;

    const db = await getDatabase();

    // Fetch template details
    let template: any = null;
    try {
      const { ObjectId } = require("mongodb");
      template = await db.collection("templates").findOne({ _id: new ObjectId(templateId) });
    } catch (e) {}

    if (!template) {
      template = await db.collection("templates").findOne({ name: templateId });
    }
    if (!template) {
      template = await db.collection("templates").findOne({}); // Fallback
    }

    if (!template) {
      return res.status(404).json({ success: false, error: "Base layout template not found" });
    }

    const websiteId = `web_${Math.random().toString(36).substring(2, 11)}`;

    // Build hydrated structure from Wizard inputs
    const clonedWebsite = {
      websiteId,
      userId,
      workspaceId: `workspace_${userId}`,
      name: websiteName || `My ${template.name}`,
      templateName: template.name,
      templateId: template.templateId || template.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      templateVersion: template.version || "1.0.0",
      websiteVersion: "1.0.0",
      updatesAvailable: false,
      assetNamespace: `cloudinary/website_${websiteId}/`,
      status: "Draft",
      lastEdited: new Date(),
      createdAt: new Date(),
      theme: {
        ...(template.theme || { colors: {}, radii: {}, fonts: {}, shadows: {} }),
        colors: {
          ...(template.theme?.colors || {}),
          primary: primaryColor,
        },
      },
      pages: template.pages || [],
      navigation: template.navigation || [],
      seo: {
        title: websiteName || template.seo?.title || template.name,
        description: `Ecommerce store built with Klin for ${businessName}.`,
        keywords: [industry, "ecommerce", "klin"].filter(Boolean),
      },
      metadata: {
        businessName,
        websiteName,
        websiteDescription: `Ecommerce store for ${businessName}.`,
        industry,
        supportEmail: userEmail,
        supportPhone: "",
        socialLinks: {},
        logo,
        favicon,
      },
      settings: {
        subdomain: subdomain || `site-${Math.random().toString(36).substring(2, 6)}`,
        customDomain: "",
        localization: {
          currency: currency || "USD",
          language: language || "en",
          timezone: timezone || "UTC",
        },
        themeStyle,
      },
    };

    await db.collection("websites").insertOne(clonedWebsite);
    await logWebsiteActivity(websiteId, "Website Created", `Website created from template '${template.name}' via Wizard.`, userEmail);
    await logWebsiteActivity(websiteId, "Template Installed", `Template '${template.name}' installed.`, userEmail);

    res.json({ success: true, website: clonedWebsite });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to create website via Wizard" });
  }
});

// POST /api/websites/install
router.post("/websites/install", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userEmail = req.user?.email || "anonymous";
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ success: false, error: "Template ID is required" });
    }

    const db = await getDatabase();

    // Fetch template details
    let template: any = null;
    try {
      const { ObjectId } = require("mongodb");
      template = await db.collection("templates").findOne({ _id: new ObjectId(templateId) });
    } catch (e) {}

    if (!template) {
      template = await db.collection("templates").findOne({ templateId });
    }
    if (!template) {
      template = await db.collection("templates").findOne({ name: templateId });
    }
    if (!template) {
      template = await db.collection("templates").findOne({}); // Fallback
    }

    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }

    const websiteId = `web_${Math.random().toString(36).substring(2, 11)}`;

    const clonedWebsite = {
      websiteId,
      userId,
      workspaceId: `workspace_${userId}`,
      name: `My ${template.name}`,
      templateName: template.name,
      templateId: template.templateId || template.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      templateVersion: template.version || "1.0.0",
      websiteVersion: "1.0.0",
      updatesAvailable: false,
      assetNamespace: `cloudinary/website_${websiteId}/`,
      status: "Draft",
      lastEdited: new Date(),
      createdAt: new Date(),
      theme: template.theme || {
        colors: { primary: "#0F1020", secondary: "#FAFBFC", accent: "#6366F1", background: "#ffffff", foreground: "#0F1020" },
        radii: { sm: "4px", md: "12px", lg: "24px" },
        fonts: { body: "Inter", heading: "Outfit" },
        shadows: { sm: "0 4px 20px rgba(0,0,0,0.05)" }
      },
      pages: template.pages || [],
      navigation: template.navigation || [],
      seo: {
        title: template.seo?.title || template.name,
        description: template.seo?.description || `Ecommerce store built with Klin.`,
        keywords: template.seo?.keywords || ["ecommerce", "klin"],
      },
      metadata: {
        businessName: `My ${template.name}`,
        websiteName: `My ${template.name}`,
        websiteDescription: `Ecommerce store built with Klin.`,
        industry: "Retail",
        supportEmail: userEmail,
        supportPhone: "",
        socialLinks: {},
        logo: "",
        favicon: "",
      },
      settings: {
        subdomain: `site-${Math.random().toString(36).substring(2, 6)}`,
        customDomain: "",
        localization: {
          currency: "USD",
          language: "en",
          timezone: "UTC",
        },
        themeStyle: "modern",
      },
    };

    await db.collection("websites").insertOne(clonedWebsite);
    await logWebsiteActivity(websiteId, "Website Created", `Website created from template '${template.name}' directly.`, userEmail);
    await logWebsiteActivity(websiteId, "Template Installed", `Template '${template.name}' installed.`, userEmail);

    res.json({ success: true, website: clonedWebsite });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to install template" });
  }
});

// POST /api/websites/:id/settings/:section
router.post("/websites/:id/settings/:section", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const section = req.params.section;
    const bodyData = req.body;
    const userEmail = req.user?.email || "anonymous";

    const db = await getDatabase();
    const website = await db.collection("websites").findOne({ websiteId });
    if (!website) return res.status(404).json({ success: false, error: "Website not found" });

    let updateQuery: any = {};
    if (section === "general") {
      updateQuery = {
        "metadata.websiteName": bodyData.websiteName,
        "metadata.websiteDescription": bodyData.websiteDescription,
        "metadata.supportEmail": bodyData.supportEmail,
        "metadata.supportPhone": bodyData.supportPhone,
      };
    } else if (section === "branding") {
      updateQuery = {
        "metadata.logo": bodyData.logo,
        "metadata.favicon": bodyData.favicon,
        "settings.themeStyle": bodyData.themeStyle,
      };
    } else if (section === "localization") {
      updateQuery = {
        "settings.localization.currency": bodyData.currency,
        "settings.localization.language": bodyData.language,
        "settings.localization.timezone": bodyData.timezone,
      };
    } else if (section === "domains") {
      updateQuery = {
        "settings.subdomain": bodyData.subdomain,
        "settings.customDomain": bodyData.customDomain,
      };
    } else {
      // General catch-all for other settings sub-sections
      updateQuery = {
        [`settings.${section}`]: bodyData,
      };
    }

    await db.collection("websites").updateOne(
      { websiteId },
      {
        $set: {
          ...updateQuery,
          lastEdited: new Date(),
        },
      }
    );

    await logWebsiteActivity(websiteId, "SEO Updated", `Updated ${section} settings.`, userEmail);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save settings section" });
  }
});

// POST /api/websites/:id/update
router.post("/websites/:id/update", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const { name, theme, pages, navigation, seo, settings, status } = req.body;
    const userEmail = req.user?.email || "anonymous";

    const db = await getDatabase();
    const updateFields: any = { lastEdited: new Date() };
    if (name !== undefined) updateFields.name = name;
    if (theme !== undefined) updateFields.theme = theme;
    if (pages !== undefined) updateFields.pages = pages;
    if (navigation !== undefined) updateFields.navigation = navigation;
    if (seo !== undefined) updateFields.seo = seo;
    if (settings !== undefined) updateFields.settings = settings;
    if (status !== undefined) updateFields.status = status;

    await db.collection("websites").updateOne(
      { websiteId },
      { $set: updateFields }
    );

    // Log activities for edits
    if (name !== undefined) await logWebsiteActivity(websiteId, "Website Renamed", `Renamed to '${name}'`, userEmail);
    if (theme !== undefined) await logWebsiteActivity(websiteId, "Theme Changed", `Theme parameters updated`, userEmail);
    if (pages !== undefined) await logWebsiteActivity(websiteId, "Autosave", `Autosaved layout parameters`, userEmail);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update website" });
  }
});

// POST /api/websites/:id/duplicate
router.post("/websites/:id/duplicate", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const userEmail = req.user?.email || "anonymous";

    const db = await getDatabase();
    const original = await db.collection("websites").findOne({ websiteId });
    if (!original) return res.status(404).json({ success: false, error: "Website not found" });

    const newId = `web_${Math.random().toString(36).substring(2, 11)}`;
    const duplicate = {
      ...original,
      _id: undefined,
      websiteId: newId,
      name: `${original.name} (Copy)`,
      status: "Draft",
      settings: {
        ...original.settings,
        subdomain: `${original.settings?.subdomain || "my-site"}-copy`,
      },
      createdAt: new Date(),
      lastEdited: new Date(),
    };

    await db.collection("websites").insertOne(duplicate);
    await logWebsiteActivity(newId, "Website Created", `Duplicated from website ${websiteId}`, userEmail);

    res.json({ success: true, website: duplicate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to duplicate" });
  }
});

// POST /api/websites/:id/archive
router.post("/websites/:id/archive", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const userEmail = req.user?.email || "anonymous";

    const db = await getDatabase();
    await db.collection("websites").updateOne(
      { websiteId },
      { $set: { status: "Archived", lastEdited: new Date() } }
    );
    await logWebsiteActivity(websiteId, "Archived", `Archived site dashboard view.`, userEmail);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to archive" });
  }
});

// DELETE /api/websites/:id
router.delete("/websites/:id", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    await db.collection("websites").deleteOne({ websiteId });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to delete" });
  }
});

// POST /api/websites/:id/pages/:slug
router.post("/websites/:id/pages/:slug", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const slug = req.params.slug;
    const { builderJson } = req.body;

    const db = await getDatabase();
    
    // Update only the specific page in the pages array matching the slug
    const result = await db.collection("websites").updateOne(
      { websiteId, "pages.slug": slug },
      {
        $set: {
          "pages.$.builderJson": builderJson,
          lastEdited: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Page slug not found under this website" });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to save page layout" });
  }
});

export default router;

import { Router, Response } from "express";
import { getDatabase } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { createSnapshot, deploySnapshot } from "../services/deployment.service";
import { logWebsiteActivity } from "../services/activity.service";

const router = Router();

// Validation helper
function validateWebsiteData(website: any) {
  const issues: string[] = [];

  // Check missing pages
  if (!website.pages || website.pages.length === 0) {
    issues.push("Website does not have any pages configured.");
  } else {
    // Check main landing pages
    const hasHome = website.pages.some((p: any) => p.slug === "home" || p.slug === "index");
    if (!hasHome) {
      issues.push("Missing primary landing page (slug 'home' or 'index').");
    }
  }

  // Check broken navigation
  if (website.navigation) {
    website.navigation.forEach((nav: any) => {
      if (!nav.links || nav.links.length === 0) {
        issues.push(`Navigation menu '${nav.name}' has no links configured.`);
      } else {
        nav.links.forEach((l: any) => {
          if (!l.label) {
            issues.push(`Empty link label in navigation '${nav.name}'.`);
          }
        });
      }
    });
  }

  // Check invalid theme tokens
  if (!website.theme || !website.theme.colors || Object.keys(website.theme.colors).length === 0) {
    issues.push("Theme color palette tokens are empty or invalid.");
  }

  // Mock checking missing component schemas
  if (website.pages) {
    website.pages.forEach((p: any) => {
      const content = p.builderJson?.content || [];
      content.forEach((block: any, idx: number) => {
        if (!block.type) {
          issues.push(`Page '/${p.slug}' block index ${idx} contains missing or unrecognized component.`);
        }
      });
    });
  }

  return issues;
}

// POST /api/websites/:id/publish
router.post("/websites/:id/publish", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const { environment = "Production", commitMessage = "Production Publish" } = req.body;
    const userEmail = req.user?.email || "anonymous";

    const db = await getDatabase();
    const website = await db.collection("websites").findOne({ websiteId });
    if (!website) {
      return res.status(404).json({ success: false, error: "Website not found" });
    }

    // Status check
    await db.collection("websites").updateOne(
      { websiteId },
      { $set: { status: "Publishing" } }
    );
    await logWebsiteActivity(websiteId, "Publishing", `Began publishing pipeline to ${environment}`, userEmail);

    // Validation
    const validationIssues = validateWebsiteData(website);
    if (validationIssues.length > 0) {
      await db.collection("websites").updateOne(
        { websiteId },
        { $set: { status: "Failed" } }
      );
      await logWebsiteActivity(websiteId, "Deployment Failed", `Publishing aborted due to ${validationIssues.length} validation errors`, userEmail);
      return res.status(400).json({
        success: false,
        error: "Publish validation failed",
        issues: validationIssues
      });
    }

    // Snapshot creation
    const snapshot = await createSnapshot(websiteId, userEmail);

    // Deploy
    const deployment = await deploySnapshot(websiteId, snapshot.snapshotId, environment, userEmail, commitMessage);

    res.json({
      success: true,
      snapshot,
      deployment
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to run publishing pipeline" });
  }
});

export default router;

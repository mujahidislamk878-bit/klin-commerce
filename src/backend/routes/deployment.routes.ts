import { Router, Response } from "express";
import { getDatabase } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { rollbackWebsite } from "../services/deployment.service";

const router = Router();

// GET /api/websites/:id/deployments
router.get("/websites/:id/deployments", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    const deployments = await db.collection("website_deployments")
      .find({ websiteId })
      .sort({ deploymentTime: -1 })
      .toArray();

    res.json({ success: true, deployments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch deployments" });
  }
});

// POST /api/websites/:id/deployments/rollback
router.post("/websites/:id/deployments/rollback", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const { snapshotId } = req.body;
    const userEmail = req.user?.email || "anonymous";

    if (!snapshotId) {
      return res.status(400).json({ success: false, error: "snapshotId is required" });
    }

    const result = await rollbackWebsite(websiteId, snapshotId, userEmail);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Rollback failed" });
  }
});

export default router;

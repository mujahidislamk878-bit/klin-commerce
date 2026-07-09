import { Router, Response } from "express";
import { getDatabase } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/websites/:id/activity
router.get("/websites/:id/activity", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    const activities = await db.collection("website_activity")
      .find({ websiteId })
      .sort({ timestamp: -1 })
      .toArray();

    res.json({ success: true, activities });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch activity logs" });
  }
});

export default router;

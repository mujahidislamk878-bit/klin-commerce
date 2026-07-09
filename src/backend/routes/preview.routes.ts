import { Router, Response } from "express";
import { getDatabase } from "../db";
import { authenticateToken, AuthenticatedRequest } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/websites/:id/preview-options
router.get("/websites/:id/preview-options", authenticateToken as any, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const websiteId = req.params.id;
    const db = await getDatabase();
    const website = await db.collection("websites").findOne({ websiteId });
    if (!website) return res.status(404).json({ success: false, error: "Website not found" });

    // Return current layout properties hydrated with test configurations
    res.json({
      success: true,
      options: {
        devices: ["Desktop", "Laptop", "Tablet", "Mobile"],
        modes: ["Light", "Dark"],
        directions: ["LTR", "RTL"],
        locales: [
          { code: "en", label: "English" },
          { code: "es", label: "Spanish" },
          { code: "fr", label: "French" }
        ],
        roles: ["Guest", "Customer", "Admin"],
        products: [
          { id: "p1", name: "Modern Desk Chair", price: "$129.00" },
          { id: "p2", name: "Mechanical Keyboard", price: "$89.00" }
        ],
        collections: [
          { id: "c1", name: "Summer Furniture Sale" },
          { id: "c2", name: "Smart Office Gears" }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to fetch preview options" });
  }
});

export default router;

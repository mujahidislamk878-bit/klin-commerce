import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Configuration from environment
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const VITE_GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || "";

console.log("\n📦 Auth Server Configuration:");
console.log("   MongoDB:", MONGODB_URI ? "✓ Configured" : "✗ Missing");
console.log("   Google Client ID:", VITE_GOOGLE_CLIENT_ID ? "✓ Configured" : "✗ Missing");
console.log("   Google Client Secret:", GOOGLE_CLIENT_SECRET ? "✓ Configured" : "✗ Missing");

// MongoDB connection
let mongoClient: MongoClient | null = null;

async function connectDB() {
  if (mongoClient) return mongoClient;

  if (!MONGODB_URI) {
    console.warn("⚠️  MONGODB_URI not set, skipping database connection");
    return null;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log("✓ Connected to MongoDB");
    return mongoClient;
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Database Seeder
async function seedDatabase() {
  const client = await connectDB();
  if (!client) return;

  const database = client.db("Klin");

  // Seed Products
  if (process.env.SEED_MOCK_DATA === "true") {
    const productsCol = database.collection("products");
    const productCount = await productsCol.countDocuments();
    if (productCount === 0) {
      const defaultProducts = [
        { name: "Minimalist Portfolio Template", description: "Sleek, clean portfolio designed for creatives and developers.", price: 49.00, category: "Templates", status: "Active", salesCount: 128, rating: 4.8, image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80" },
        { name: "SaaS Analytics Dashboard UI Kit", description: "Bento-grid styled UI component set for analytics interfaces.", price: 89.00, category: "UI Kits", status: "Active", salesCount: 84, rating: 4.9, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" },
        { name: "E-Commerce Tailwind Bundle", description: "Complete set of components for building high-converting online stores.", price: 129.00, category: "Code", status: "Active", salesCount: 95, rating: 4.7, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" },
        { name: "Glassmorphic Icon Pack", description: "150+ high-quality 3D rendered glassmorphic icons.", price: 29.00, category: "Assets", status: "Draft", salesCount: 0, rating: 4.5, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
        { name: "Corporate Landing Builder", description: "Enterprise-grade layout blocks optimized for search and conversion.", price: 199.00, category: "Templates", status: "Active", salesCount: 42, rating: 4.6, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" }
      ];
      await productsCol.insertMany(defaultProducts);
      console.log("✓ Seeded default products");
    }
  }

  // Seed Orders
  if (process.env.SEED_MOCK_DATA === "true") {
    const ordersCol = database.collection("orders");
    const orderCount = await ordersCol.countDocuments();
    if (orderCount === 0) {
      const defaultOrders = [
        { orderNumber: "ORD-9281", customerName: "Sarah Jenkins", customerEmail: "sarah@example.com", total: 49.00, status: "Completed", date: new Date(Date.now() - 3600000 * 2) },
        { orderNumber: "ORD-9280", customerName: "Marcus Vance", customerEmail: "marcus@vance.io", total: 178.00, status: "Completed", date: new Date(Date.now() - 3600000 * 5) },
        { orderNumber: "ORD-9279", customerName: "Emily Wong", customerEmail: "emily.w@designstudio.com", total: 89.00, status: "Pending", date: new Date(Date.now() - 3600000 * 12) },
        { orderNumber: "ORD-9278", customerName: "David Miller", customerEmail: "david@miller-consulting.net", total: 129.00, status: "Completed", date: new Date(Date.now() - 3600000 * 24) },
        { orderNumber: "ORD-9277", customerName: "Sophia Loren", customerEmail: "sophia@loren-design.it", total: 29.00, status: "Cancelled", date: new Date(Date.now() - 3600000 * 36) }
      ];
      await ordersCol.insertMany(defaultOrders);
      console.log("✓ Seeded default orders");
    }
  }

  // Seed Templates
  const templatesCol = database.collection("templates");
  const hasKlinShopTemplate = await templatesCol.findOne({ name: "Klin Premium Storefront", version: "1.2.0" });
  if (!hasKlinShopTemplate) {
    await templatesCol.deleteMany({});
    const defaultTemplates = [
      {
        name: "Klin Premium Storefront",
        templateId: "klin-premium-storefront",
        author: "Klin Core Team",
        version: "1.2.0",
        minKlinVersion: "3.5.0",
        compatibility: { builder: "v3", themeEngine: "v2", commerce: "v1", cms: "v1" },
        category: "E-Commerce",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
        downloads: 4820,
        rating: 4.9,
        description: "Premium high-conversion storefront utilizing storefront blocks.",
        theme: {
          colors: { primary: "#0F1020", secondary: "#FAFBFC", accent: "#6366F1", background: "#ffffff", foreground: "#0F1020" },
          radii: { sm: "4px", md: "12px", lg: "24px" },
          fonts: { body: "Inter", heading: "Outfit" },
          shadows: { sm: "0 4px 20px rgba(0,0,0,0.05)" }
        },
        pages: [
          {
            title: "Home",
            slug: "home",
            builderJson: {
              content: [
                {
                  type: "Navbar",
                  props: {
                    id: "nav-shop",
                    brand: "Klin Storefront"
                  }
                },
                {
                  type: "Hero",
                  props: {
                    id: "hero-shop",
                    eyebrow: "Limited Edition Drop",
                    title: "Minimalist Goods for Modern Life",
                    sub: "Curated essentials designed with attention to detail. Free delivery worldwide.",
                    cta: "Explore Catalog",
                    bg: "#0B0C10",
                    ink: "#FFFFFF",
                    accent: "#6366F1"
                  }
                },
                {
                  type: "DiscountBanner",
                  props: {
                    id: "promo-shop",
                    code: "KLINSPRING20",
                    percentOff: 20,
                    theme: "dark"
                  }
                },
                {
                  type: "ProductShowcase",
                  props: {
                    id: "showcase-shop",
                    productId: "p_1",
                    titleOverride: "Premium Leather Sneakers",
                    showPrice: true,
                    accentColor: "#6366F1"
                  }
                },
                {
                  type: "ProductGrid",
                  props: {
                    id: "grid-shop",
                    limit: 3,
                    columns: "3",
                    showBorder: true
                  }
                },
                {
                  type: "Testimonials",
                  props: {
                    id: "test-shop",
                    quote: "Klin's products have redefined the meaning of premium simplicity in my daily wardrobe.",
                    author: "Marcus Sterling, Creative Director",
                    bg: "#FAFBFC",
                    ink: "#0F1020"
                  }
                },
                {
                  type: "Footer",
                  props: {
                    id: "foot-shop",
                    brand: "Klin Premium Storefront"
                  }
                }
              ],
              root: {
                props: {
                  title: "Klin Premium Storefront"
                }
              }
            }
          }
        ],
        navigation: [
          { name: "Header Menu", links: [{ label: "Home", href: "/home" }] },
          { name: "Footer Menu", links: [{ label: "Home", href: "/home" }] }
        ],
        seo: { title: "Klin Premium Storefront", description: "Design meets commerce.", keywords: ["storefront", "ecommerce", "klin"] },
        settings: { subdomain: "klin-storefront", customDomain: "" }
      }
    ];
    await templatesCol.insertMany(defaultTemplates);
    console.log("✓ Seeded custom E-Commerce Storefront template successfully");
  }

  // Seed Payments
  if (process.env.SEED_MOCK_DATA === "true") {
    const paymentsCol = database.collection("payments");
    const paymentCount = await paymentsCol.countDocuments();
    if (paymentCount === 0) {
      const defaultPayments = [
        { paymentId: "TXN-739183", orderId: "ORD-9281", customerName: "Sarah Jenkins", amount: 49.00, status: "Successful", paymentMethod: "Stripe (Visa)", date: new Date(Date.now() - 3600000 * 2) },
        { paymentId: "TXN-739182", orderId: "ORD-9280", customerName: "Marcus Vance", amount: 178.00, status: "Successful", paymentMethod: "PayPal", date: new Date(Date.now() - 3600000 * 5) },
        { paymentId: "TXN-739181", orderId: "ORD-9279", customerName: "Emily Wong", amount: 89.00, status: "Processing", paymentMethod: "Apple Pay", date: new Date(Date.now() - 3600000 * 12) },
        { paymentId: "TXN-739180", orderId: "ORD-9278", customerName: "David Miller", amount: 129.00, status: "Successful", paymentMethod: "Stripe (Mastercard)", date: new Date(Date.now() - 3600000 * 24) }
      ];
      await paymentsCol.insertMany(defaultPayments);
      console.log("✓ Seeded default payments");
    }
  }

  // Seed Discounts
  if (process.env.SEED_MOCK_DATA === "true") {
    const discountsCol = database.collection("discounts");
    const discountCount = await discountsCol.countDocuments();
    if (discountCount === 0) {
      const defaultDiscounts = [
        { code: "WELCOME20", type: "percentage", value: 20, minPurchase: 50, usageLimit: 100, usedCount: 45, status: "Active", expiresAt: new Date(Date.now() + 365 * 24 * 3600000 * 1000), createdAt: new Date(Date.now() - 30 * 24 * 3600000) },
        { code: "SAVE10", type: "fixed", value: 10, minPurchase: 30, usageLimit: 50, usedCount: 12, status: "Active", expiresAt: new Date(Date.now() + 180 * 24 * 3600000), createdAt: new Date(Date.now() - 60 * 24 * 3600000) },
        { code: "FREESHIP", type: "percentage", value: 100, minPurchase: 0, usageLimit: 200, usedCount: 87, status: "Active", expiresAt: new Date(Date.now() + 90 * 24 * 3600000), createdAt: new Date(Date.now() - 15 * 24 * 3600000) },
        { code: "FLASH25", type: "percentage", value: 25, minPurchase: 100, usageLimit: 30, usedCount: 30, status: "Expired", expiresAt: new Date(Date.now() - 10 * 24 * 3600000), createdAt: new Date(Date.now() - 90 * 24 * 3600000) },
        { code: "VIP15", type: "percentage", value: 15, minPurchase: 0, usageLimit: 200, usedCount: 3, status: "Active", expiresAt: new Date(Date.now() + 365 * 24 * 3600000 * 2), createdAt: new Date(Date.now() - 120 * 24 * 3600000) }
      ];
      await discountsCol.insertMany(defaultDiscounts);
      console.log("✓ Seeded discount codes");
    }
  }
}

// Memory store for mock users during development/testing
const mockUsersDb: Record<string, { onboarding: boolean }> = {};

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || (req.body && req.body.token);

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. Token is required." });
  }

  if (token.startsWith("token_")) {
    req.user = { userId: token, email: "user@example.com", name: "Mock User" };
    return next();
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

// Initialize DB connection on startup
connectDB()
  .then(() => seedDatabase())
  .catch(console.error);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Google OAuth callback handler
app.post("/api/auth/google-callback", async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;

    console.log("[AUTH] Received code:", code?.slice(0, 20) + "...");
    console.log("[AUTH] Redirect URI:", redirectUri);

    if (!code) {
      return res.status(400).json({ success: false, error: "Authorization code is required" });
    }

    if (!VITE_GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("[AUTH] Google credentials missing");
      return res.status(500).json({ success: false, error: "Server misconfigured" });
    }

    // Step 1: Exchange code for Google tokens
    console.log("[AUTH] Exchanging code for tokens...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: VITE_GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("[AUTH] Token exchange failed:", error);
      return res.status(400).json({ success: false, error: "Failed to exchange code for tokens" });
    }

    const tokens = await tokenResponse.json();
    console.log("[AUTH] Got tokens, id_token present:", !!tokens.id_token);

    // Step 2: Decode ID token to get user info
    const idTokenParts = tokens.id_token.split(".");
    if (idTokenParts.length !== 3) {
      return res.status(400).json({ success: false, error: "Invalid ID token" });
    }

    const payload = JSON.parse(Buffer.from(idTokenParts[1], "base64").toString());
    console.log("[AUTH] User info:", { id: payload.sub, email: payload.email, name: payload.name });

    // Step 3: Save user to MongoDB
    const db = await connectDB();
    let dbUser: any = null;
    if (db) {
      try {
        const usersCollection = db.db("Klin").collection("users");

        const user: any = await usersCollection.findOneAndUpdate(
          { googleId: payload.sub },
          {
            $set: {
              googleId: payload.sub,
              email: payload.email,
              name: payload.name || "User",
              picture: payload.picture,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true, returnDocument: "after" }
        );

        dbUser = user?.value || user;
        console.log("[AUTH] User saved/updated:", dbUser?._id);
      } catch (dbError) {
        console.error("[AUTH] Database error:", dbError instanceof Error ? dbError.message : dbError);
      }
    } else {
      console.warn("[AUTH] MongoDB not available, user will not be saved to database");
    }

    // Step 4: Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: payload.sub,
        email: payload.email,
        name: payload.name || "User",
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("[AUTH] JWT token generated for:", payload.email);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        userId: payload.sub,
        email: payload.email,
        name: payload.name || "User",
        picture: payload.picture,
        onboarding: dbUser ? !!dbUser.onboarding : false,
      },
    });
  } catch (error) {
    console.error("[AUTH] Callback error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    });
  }
});

// Verify token endpoint
app.post("/api/auth/verify", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, error: "Token is required" });
    }

    if (token.startsWith("token_")) {
      const db = await connectDB();
      let mockUser: any = null;
      if (db) {
        mockUser = await db.db("Klin").collection("users").findOne({ googleId: token });
      }
      if (!mockUser) {
        mockUser = (mockUsersDb as any)[token] || { onboarding: false };
      }
      return res.json({
        success: true,
        user: {
          userId: token,
          email: "user@example.com",
          name: mockUser.firstName ? `${mockUser.firstName} ${mockUser.lastName || ""}` : "Mock User",
          firstName: mockUser.firstName || "",
          lastName: mockUser.lastName || "",
          onboarding: !!mockUser.onboarding
        }
      });
    }

    const verified = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    
    // Query DB to get fresh onboarding status
    const db = await connectDB();
    let onboarding = false;
    let firstName = "";
    let lastName = "";
    if (db) {
      const user = await db.db("Klin").collection("users").findOne({ googleId: verified.userId });
      if (user) {
        onboarding = !!user.onboarding;
        firstName = user.firstName || "";
        lastName = user.lastName || "";
      }
    }

    res.json({
      success: true,
      user: {
        ...verified,
        firstName,
        lastName,
        onboarding
      }
    });
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.json({ success: true });
});

// Onboarding status update
app.post("/api/user/onboarding", authenticateToken, async (req: Request, res: Response) => {
  try {
    const verified = (req as any).user;
    const { firstName, lastName, companyName, businessType, occupations, teamSize } = req.body;

    if (verified.userId && verified.userId.startsWith("token_")) {
      (mockUsersDb as any)[verified.userId] = { 
        onboarding: true,
        firstName,
        lastName,
        companyName,
        businessType,
        occupations,
        teamSize
      };
      const db = await connectDB();
      if (db) {
        await db.db("Klin").collection("users").updateOne(
          { googleId: verified.userId },
          { 
            $set: { 
              googleId: verified.userId,
              onboarding: true, 
              firstName, 
              lastName, 
              companyName, 
              businessType, 
              occupations, 
              teamSize,
              updatedAt: new Date() 
            } 
          },
          { upsert: true }
        );
      }
      return res.json({ success: true });
    }
    const db = await connectDB();
    if (!db) {
      return res.status(500).json({ success: false, error: "Database not available" });
    }

    const usersCollection = db.db("Klin").collection("users");
    await usersCollection.updateOne(
      { googleId: verified.userId },
      { 
        $set: { 
          onboarding: true, 
          firstName, 
          lastName, 
          companyName, 
          businessType, 
          occupations, 
          teamSize,
          updatedAt: new Date() 
        } 
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("[ONBOARDING] Update failed:", error);
    res.status(500).json({ success: false, error: "Failed to save onboarding state" });
  }
});

// Dashboard Home stats
app.get("/api/dashboard/home", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const database = db.db("Klin");

    const ordersCount = await database.collection("orders").countDocuments({ status: "Completed" });
    const productsCount = await database.collection("products").countDocuments();
    const templatesCount = await database.collection("templates").countDocuments();

    // Sum totals of completed orders
    const orders = await database.collection("orders").find({}).toArray();
    const revenue = orders
      .filter(o => o.status === "Completed")
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Recent orders
    const recentOrders = await database.collection("orders")
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    res.json({
      success: true,
      stats: {
        revenue: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ordersCount,
        productsCount,
        templatesCount
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch dashboard home data" });
  }
});

// Dashboard Orders
app.get("/api/dashboard/orders", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const orders = await db.db("Klin").collection("orders").find({}).sort({ date: -1 }).toArray();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// Dashboard Products
app.get("/api/dashboard/products", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const products = await db.db("Klin").collection("products").find({}).toArray();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
});

// Dashboard Templates
app.get("/api/dashboard/templates", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const templates = await db.db("Klin").collection("templates").find({}).toArray();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch templates" });
  }
});

// POST /api/templates/submit
app.post("/api/templates/submit", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      name,
      templateId,
      category,
      thumbnail,
      description,
      theme,
      pages,
      navigation,
      seo,
      settings,
      author,
      version,
      minKlinVersion,
      compatibility
    } = req.body;

    if (!name || !pages || pages.length === 0) {
      return res.status(400).json({ success: false, error: "Template name and pages content are required" });
    }

    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const templatesCol = db.db("Klin").collection("templates");

    const finalTemplateId = templateId || name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const newTemplate = {
      name,
      templateId: finalTemplateId,
      category: category || "General",
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      description: description || "Custom template layout uploaded by a creator.",
      downloads: 0,
      rating: 5.0,
      theme: theme || {
        colors: { primary: "#6366F1", secondary: "#FAFBFC", accent: "#6366F1", background: "#ffffff", foreground: "#0F1020" },
        radii: { sm: "4px", md: "12px", lg: "24px" },
        fonts: { body: "Inter", heading: "Outfit" },
        shadows: { sm: "0 4px 20px rgba(0,0,0,0.05)" }
      },
      pages: pages.map((page: any) => ({
        title: page.title || "Home",
        slug: page.slug || "home",
        builderJson: page.builderJson || { content: [], root: {} }
      })),
      navigation: navigation || [
        { name: "Header Menu", links: [{ label: "Home", href: "/home" }] },
        { name: "Footer Menu", links: [{ label: "Home", href: "/home" }] }
      ],
      seo: seo || { title: name, description },
      settings: settings || { subdomain: finalTemplateId },
      author: author || "Klin Creator",
      version: version || "1.0.0",
      minKlinVersion: minKlinVersion || "3.5.0",
      compatibility: compatibility || { builder: "v3", themeEngine: "v2", commerce: "v1", cms: "v1" },
      createdAt: new Date()
    };

    await templatesCol.updateOne(
      { templateId: finalTemplateId },
      { $set: newTemplate },
      { upsert: true }
    );

    res.json({ success: true, message: `Template '${name}' uploaded successfully.`, template: newTemplate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to submit template" });
  }
});

// GET /api/templates/:id
app.get("/api/templates/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const { ObjectId } = require("mongodb");
    let template = null;
    try {
      template = await db.db("Klin").collection("templates").findOne({ _id: new ObjectId(templateId) });
    } catch (e) {}
    if (!template) {
      template = await db.db("Klin").collection("templates").findOne({ templateId });
    }
    if (!template) return res.status(404).json({ success: false, error: "Template not found" });
    res.json({ success: true, template });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/templates/:id/save
app.post("/api/templates/:id/save", authenticateToken, async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const { pages } = req.body;
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const { ObjectId } = require("mongodb");
    
    let query: any = { templateId };
    try {
      query = { $or: [{ _id: new ObjectId(templateId) }, { templateId }] };
    } catch(e) {}

    await db.db("Klin").collection("templates").updateOne(
      query,
      { $set: { pages, lastEdited: new Date() } }
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard Payments
app.get("/api/dashboard/payment", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const payments = await db.db("Klin").collection("payments").find({}).sort({ date: -1 }).toArray();
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
});

// Dashboard Analytics
app.get("/api/dashboard/analytics", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const database = db.db("Klin");

    const orders = await database.collection("orders").find({}).toArray();
    const completedOrders = orders.filter((o: any) => o.status === "Completed");
    const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const orderCount = orders.length;
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const customerCount = await database.collection("users").countDocuments();

    const topProducts = await database.collection("products").find({}).sort({ salesCount: -1 }).limit(5).toArray();
    const recentOrders = await database.collection("orders").find({}).sort({ date: -1 }).limit(5).toArray();

    const monthlySales = [
      { month: "Jan", revenue: 4200, orders: 38 },
      { month: "Feb", revenue: 3800, orders: 32 },
      { month: "Mar", revenue: 5100, orders: 45 },
      { month: "Apr", revenue: 4800, orders: 41 },
      { month: "May", revenue: 6200, orders: 53 },
      { month: "Jun", revenue: 5800, orders: 49 }
    ];

    res.json({
      success: true,
      totalRevenue,
      revenueGrowth: 12.5,
      orderCount,
      orderGrowth: 8.3,
      customerCount,
      customerGrowth: 15.2,
      conversionRate: 3.45,
      averageOrderValue,
      monthlySales,
      topProducts,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch analytics data" });
  }
});

// Dashboard Customers
app.get("/api/dashboard/customers", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const database = db.db("Klin");

    const users = await database.collection("users").find({}).toArray();
    const orders = await database.collection("orders").find({}).toArray();

    const customers = users.map((u: any) => {
      const customerOrders = orders.filter((o: any) => o.customerEmail === u.email);
      const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      return {
        id: u._id.toString(),
        name: u.name || "Unknown",
        email: u.email || "",
        avatar: u.picture || "",
        orders: customerOrders.length,
        totalSpent,
        joinedAt: u.createdAt || u.updatedAt || new Date()
      };
    });

    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch customers" });
  }
});

// Dashboard Marketing
app.get("/api/dashboard/marketing", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const database = db.db("Klin");

    const campaigns = [
      { id: 1, name: "Summer Sale Blast", type: "Email", status: "Active", reach: 12500, clicks: 1840, conversions: 230, budget: 5000, spent: 3200, startDate: "2026-06-01", endDate: "2026-06-30" },
      { id: 2, name: "New Product Launch", type: "Social", status: "Active", reach: 45200, clicks: 5230, conversions: 415, budget: 12000, spent: 8900, startDate: "2026-05-15", endDate: "2026-07-15" },
      { id: 3, name: "Brand Awareness Q2", type: "Paid", status: "Paused", reach: 88000, clicks: 7200, conversions: 180, budget: 20000, spent: 15000, startDate: "2026-04-01", endDate: "2026-06-30" },
      { id: 4, name: "Weekend Flash Deal", type: "Email", status: "Draft", reach: 0, clicks: 0, conversions: 0, budget: 3000, spent: 0, startDate: "2026-07-10", endDate: "2026-07-12" }
    ];

    const emailSubscribers = await database.collection("settings").countDocuments({ marketingEmails: true });
    const totalReach = campaigns.reduce((sum: number, c: any) => sum + c.reach, 0);
    const totalConversions = campaigns.reduce((sum: number, c: any) => sum + c.conversions, 0);

    res.json({ success: true, campaigns, emailSubscribers, totalReach, totalConversions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch marketing data" });
  }
});

// Dashboard Discounts
app.get("/api/dashboard/discounts", authenticateToken, async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    const discounts = await db.db("Klin").collection("discounts").find({}).toArray();
    res.json({ success: true, discounts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch discounts" });
  }
});

// Dashboard Settings (get)
app.get("/api/dashboard/settings", authenticateToken, async (req: Request, res: Response) => {
  try {
    const verified = (req as any).user;
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
        const settingsCol = db.db("Klin").collection("settings");
    let settings: any = await settingsCol.findOne({ userId: verified.userId });

    if (!settings) {
      // Default settings
      settings = {
        userId: verified.userId,
        theme: "dark",
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        businessName: "Klin Workspace",
        businessLogo: "",
        supportEmail: verified.email
      };
      await settingsCol.insertOne(settings);
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch settings" });
  }
});

// Dashboard Settings (update)
app.post("/api/dashboard/settings", authenticateToken, async (req: Request, res: Response) => {
  try {
    const verified = (req as any).user;
    const { theme, emailNotifications, pushNotifications, marketingEmails, businessName, businessLogo, supportEmail } = req.body;
    const db = await connectDB();
    if (!db) return res.status(500).json({ success: false, error: "Database not available" });
    
    const settingsCol = db.db("Klin").collection("settings");
    await settingsCol.updateOne(
      { userId: verified.userId },
      {
        $set: {
          theme,
          emailNotifications,
          pushNotifications,
          marketingEmails,
          businessName,
          businessLogo,
          supportEmail,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save settings" });
  }
});

// ── MOUNT DECOUPLED BACKEND ROUTES ──
import websiteRoutes from "./backend/routes/website.routes";
import previewRoutes from "./backend/routes/preview.routes";
import rendererRoutes from "./backend/routes/renderer.routes";
import publishRoutes from "./backend/routes/publish.routes";
import deploymentRoutes from "./backend/routes/deployment.routes";
import activityRoutes from "./backend/routes/activity.routes";
import seoRoutes from "./backend/routes/seo.routes";

app.use("/api", websiteRoutes);
app.use("/api", previewRoutes);
app.use("/api", rendererRoutes);
app.use("/api", publishRoutes);
app.use("/api", deploymentRoutes);
app.use("/api", activityRoutes);
app.use(seoRoutes);


// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Klin Auth Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Available Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/google-callback`);
  console.log(`   POST /api/auth/verify`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   POST /api/user/onboarding`);
  console.log(`   GET  /api/dashboard/home`);
  console.log(`   GET  /api/dashboard/orders`);
  console.log(`   GET  /api/dashboard/products`);
  console.log(`   GET  /api/dashboard/templates`);
  console.log(`   GET  /api/dashboard/payment`);
  console.log(`   GET  /api/dashboard/analytics`);
  console.log(`   GET  /api/dashboard/customers`);
  console.log(`   GET  /api/dashboard/marketing`);
  console.log(`   GET  /api/dashboard/discounts`);
  console.log(`   GET  /api/dashboard/settings`);
  console.log(`   POST /api/dashboard/settings\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    if (mongoClient) {
      mongoClient.close();
    }
    process.exit(0);
  });
});

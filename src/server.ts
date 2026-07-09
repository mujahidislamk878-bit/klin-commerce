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

  // Seed Orders
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

  // Seed Templates
  const templatesCol = database.collection("templates");
  const templateCount = await templatesCol.countDocuments();
  if (templateCount === 0) {
    const defaultTemplates = [
      { name: "Aura Creative Portfolio", category: "Portfolio", thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80", downloads: 1420, rating: 4.8, description: "A dark theme minimal portfolio for digital creators." },
      { name: "Apex SaaS Platform", category: "SaaS", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80", downloads: 890, rating: 4.9, description: "High-conversion product layout with charts." },
      { name: "Nova E-Commerce Store", category: "E-Commerce", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80", downloads: 2310, rating: 4.7, description: "Clean store template with filter and checkout interfaces." }
    ];
    await templatesCol.insertMany(defaultTemplates);
    console.log("✓ Seeded default templates");
  }

  // Seed Payments
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
      const mockUser = (mockUsersDb as any)[token] || { onboarding: false };
      return res.json({
        success: true,
        user: {
          userId: token,
          email: "user@example.com",
          name: mockUser.firstName ? `${mockUser.firstName} ${mockUser.lastName || ""}` : "Mock User",
          firstName: mockUser.firstName || "",
          lastName: mockUser.lastName || "",
          onboarding: mockUser.onboarding
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

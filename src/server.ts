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

// Initialize DB connection on startup
connectDB().catch(console.error);

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
    if (db) {
      try {
        const usersCollection = db.db("Klin").collection("users");

        const user = await usersCollection.findOneAndUpdate(
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

        console.log("[AUTH] User saved/updated:", user.value?._id);
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
app.post("/api/auth/verify", (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, error: "Token is required" });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: verified });
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req: Request, res: Response) => {
  res.json({ success: true });
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
  console.log(`   POST /api/auth/logout\n`);
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

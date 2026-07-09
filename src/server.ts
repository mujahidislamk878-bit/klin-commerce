import express, { Request, Response } from "express";
import cors from "cors";
import {
  exchangeGoogleCode,
  getGoogleUserInfo,
  createOrUpdateUser,
  generateToken,
  verifyToken,
  type User,
} from "./auth";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Google OAuth callback handler
app.post("/api/auth/google-callback", async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    // Exchange code for Google tokens
    const tokenResponse = await exchangeGoogleCode(code, redirectUri);

    // Get user info from ID token
    const googleUserInfo = await getGoogleUserInfo(tokenResponse.id_token);

    // Create or update user in MongoDB
    const user = await createOrUpdateUser(googleUserInfo);

    // Generate JWT token
    const jwtToken = generateToken(user);

    // Return user data and JWT token
    res.json({
      success: true,
      token: jwtToken,
      user: {
        userId: user._id?.toString() || user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    });
  }
});

// Verify session/token
app.post("/api/auth/verify", (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const verified = verifyToken(token);

    if (!verified) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.json({
      success: true,
      user: verified,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req: Request, res: Response) => {
  // Just return success - client handles clearing localStorage
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

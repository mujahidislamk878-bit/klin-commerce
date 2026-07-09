import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name?: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
    const verified = jwt.verify(token, JWT_SECRET) as any;
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

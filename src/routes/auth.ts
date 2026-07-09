import { MongoClient, Db } from "mongodb";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const VITE_GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || "";

let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("Klin");
  cachedDb = db;
  return db;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface User {
  _id?: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Exchange Google authorization code for tokens
export async function exchangeGoogleCode(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
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

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`);
  }

  return response.json();
}

// Get Google user info from id_token
export async function getGoogleUserInfo(idToken: string): Promise<GoogleUserInfo> {
  // Decode the id_token (simple JWT decode - doesn't verify signature)
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid ID token");
  }

  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name || "",
    picture: payload.picture,
  };
}

// Create or update user in MongoDB
export async function createOrUpdateUser(googleUserInfo: GoogleUserInfo): Promise<User> {
  const db = await getDb();
  const usersCollection = db.collection<User>("users");

  const existingUser = await usersCollection.findOne({ googleId: googleUserInfo.id });

  if (existingUser) {
    // Update existing user
    const result = await usersCollection.findOneAndUpdate(
      { googleId: googleUserInfo.id },
      {
        $set: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return ((result as any)?.value || result) as any as User;
  }

  // Create new user
  const newUser: User = {
    googleId: googleUserInfo.id,
    email: googleUserInfo.email,
    name: googleUserInfo.name,
    picture: googleUserInfo.picture,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await usersCollection.insertOne(newUser);
  return newUser;
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user._id?.toString() || user.googleId,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
  } catch {
    return null;
  }
}

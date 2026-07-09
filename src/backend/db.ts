import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

let mongoClient: MongoClient | null = null;

export async function connectDB() {
  if (mongoClient) return mongoClient;

  if (!MONGODB_URI) {
    console.warn("⚠️  MONGODB_URI not set in backend db manager");
    return null;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    return mongoClient;
  } catch (error) {
    console.error("✗ MongoDB connection failed inside backend db manager:", error);
    return null;
  }
}

export async function getDatabase() {
  const client = await connectDB();
  if (!client) throw new Error("Database not connected");
  return client.db("Klin");
}

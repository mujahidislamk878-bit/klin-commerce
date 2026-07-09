import { getDatabase } from "../db";

export interface WebsiteActivity {
  websiteId: string;
  activityId: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

export async function logWebsiteActivity(
  websiteId: string,
  type: string,
  description: string,
  user: string
) {
  try {
    const db = await getDatabase();
    const activityCol = db.collection("website_activity");
    const activity: WebsiteActivity = {
      websiteId,
      activityId: `act_${Math.random().toString(36).substring(2, 11)}`,
      type,
      description,
      timestamp: new Date(),
      user,
    };
    await activityCol.insertOne(activity);
    console.log(`[ACTIVITY LOGGED] ${type} for website ${websiteId}: ${description}`);
    return activity;
  } catch (error) {
    console.error("Failed to log website activity:", error);
    return null;
  }
}

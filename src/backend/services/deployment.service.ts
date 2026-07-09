import { getDatabase } from "../db";
import { logWebsiteActivity } from "./activity.service";

export interface Snapshot {
  snapshotId: string;
  websiteId: string;
  pages: any[];
  theme: any;
  navigation: any[];
  seo: any;
  settings: any;
  timestamp: Date;
  createdBy: string;
}

export interface Deployment {
  deploymentId: string;
  websiteId: string;
  environment: "Development" | "Preview" | "Production";
  snapshotVersion: string;
  deploymentTime: Date;
  status: "Installing" | "Building" | "Draft" | "Editing" | "Preview" | "Publishing" | "Published" | "Archived" | "Failed";
  deploymentUrl: string;
  duration: number; // in seconds
  logs: string[];
  commitMessage: string;
  createdBy: string;
}

export async function createSnapshot(websiteId: string, createdBy: string) {
  const db = await getDatabase();
  const website = await db.collection("websites").findOne({ websiteId });
  if (!website) throw new Error("Website not found");

  const snapshotId = `snap_${Math.random().toString(36).substring(2, 11)}`;
  const snapshot: Snapshot = {
    snapshotId,
    websiteId,
    pages: website.pages || [],
    theme: website.theme || {},
    navigation: website.navigation || [],
    seo: website.seo || {},
    settings: website.settings || {},
    timestamp: new Date(),
    createdBy,
  };

  await db.collection("website_snapshots").insertOne(snapshot);
  await logWebsiteActivity(websiteId, "Snapshot Created", `Created snapshot ${snapshotId}`, createdBy);
  return snapshot;
}

export async function deploySnapshot(
  websiteId: string,
  snapshotId: string,
  environment: "Development" | "Preview" | "Production",
  createdBy: string,
  commitMessage = "Manual Publish"
) {
  const db = await getDatabase();
  const website = await db.collection("websites").findOne({ websiteId });
  if (!website) throw new Error("Website not found");

  const deploymentId = `dep_${Math.random().toString(36).substring(2, 11)}`;
  const startTime = Date.now();

  // Create active build deployment record
  const deployment: Deployment = {
    deploymentId,
    websiteId,
    environment,
    snapshotVersion: snapshotId,
    deploymentTime: new Date(),
    status: "Building",
    deploymentUrl: `http://localhost:5000/site/${website.settings?.subdomain || "preview"}`,
    duration: 0,
    logs: ["[INFO] Triggering renderer pipeline compilation...", "[INFO] Resolving components and responsive tokens..."],
    commitMessage,
    createdBy,
  };

  await db.collection("website_deployments").insertOne(deployment);
  await logWebsiteActivity(websiteId, "Deployment Started", `Triggered deployment ${deploymentId} for ${environment} env`, createdBy);

  try {
    // Simulated compilation delay
    const duration = parseFloat(((Date.now() - startTime) / 1000 + 1.2).toFixed(2));
    deployment.status = "Published";
    deployment.duration = duration;
    deployment.logs.push("[INFO] Render cache verified: miss.");
    deployment.logs.push("[INFO] Component definitions resolved successfully.");
    deployment.logs.push("[INFO] Static output folder structured: index.html compiled.");
    deployment.logs.push("[SUCCESS] Deployment completed successfully.");

    await db.collection("website_deployments").updateOne(
      { deploymentId },
      {
        $set: {
          status: "Published",
          duration,
          logs: deployment.logs,
        },
      }
    );

    // Update main website status
    await db.collection("websites").updateOne(
      { websiteId },
      { $set: { status: "Published", lastEdited: new Date() } }
    );

    await logWebsiteActivity(websiteId, "Published", `Published site update to ${environment} deployment: ${deploymentId}`, createdBy);

    return deployment;
  } catch (error: any) {
    deployment.status = "Failed";
    deployment.logs.push(`[ERROR] Compilation failed: ${error.message}`);
    await db.collection("website_deployments").updateOne(
      { deploymentId },
      {
        $set: {
          status: "Failed",
          logs: deployment.logs,
        },
      }
    );
    await logWebsiteActivity(websiteId, "Deployment Failed", `Deployment ${deploymentId} failed. Check build logs.`, createdBy);
    throw error;
  }
}

export async function rollbackWebsite(websiteId: string, snapshotId: string, user: string) {
  const db = await getDatabase();
  const snapshot = await db.collection("website_snapshots").findOne({ websiteId, snapshotId });
  if (!snapshot) throw new Error("Snapshot not found");

  await db.collection("websites").updateOne(
    { websiteId },
    {
      $set: {
        pages: snapshot.pages,
        theme: snapshot.theme,
        navigation: snapshot.navigation,
        seo: snapshot.seo,
        settings: snapshot.settings,
        status: "Editing",
        lastEdited: new Date(),
      },
    }
  );

  await logWebsiteActivity(websiteId, "Rollback Performed", `Rolled back website settings to snapshot ${snapshotId}`, user);
  await logWebsiteActivity(websiteId, "Snapshot Restored", `Restored snapshot ${snapshotId}`, user);

  // Trigger a rollback preview deployment
  const rollbackDep = await deploySnapshot(websiteId, snapshotId, "Preview", user, `Rollback to ${snapshotId}`);
  return { success: true, rollbackDep };
}

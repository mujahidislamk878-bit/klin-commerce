import { RenderContext } from "../core/RenderContext";
import { RuntimeEvents } from "../events/RuntimeEvents";

export class SnapshotService {
  public static async generateSnapshot(
    websiteId: string,
    token: string,
    context: RenderContext
  ): Promise<{ success: boolean; snapshot?: any; error?: string }> {
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ environment: "Preview", commitMessage: "Auto Snapshot" })
      });

      const result = await res.json();
      if (result.success) {
        RuntimeEvents.emit("Snapshot Created", { websiteId, snapshotId: result.snapshot.snapshotId });
        return { success: true, snapshot: result.snapshot };
      } else {
        return { success: false, error: result.error || "Failed to create snapshot" };
      }
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to generate snapshot" };
    }
  }
}
export default SnapshotService;

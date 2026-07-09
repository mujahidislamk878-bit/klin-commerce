import { RenderContext } from "../core/RenderContext";
import { ValidationService } from "./ValidationService";
import { RuntimeEvents } from "../events/RuntimeEvents";

export class PublishingService {
  public static async publishWebsite(
    websiteId: string,
    token: string,
    context: RenderContext,
    environment = "Production"
  ): Promise<{ success: boolean; snapshot?: any; deployment?: any; errors?: string[] }> {
    // Validate
    const issues = ValidationService.validateContext(context);
    const criticalErrors = issues.filter((i) => i.severity === "error");

    if (criticalErrors.length > 0) {
      return {
        success: false,
        errors: criticalErrors.map((e) => e.message),
      };
    }

    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ environment }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Publish server request failed");
      }

      const result = await res.json();
      if (result.success) {
        // Emit events
        RuntimeEvents.emit("Snapshot Created", { websiteId, snapshotId: result.snapshot.snapshotId });
        return {
          success: true,
          snapshot: result.snapshot,
          deployment: result.deployment,
        };
      } else {
        return {
          success: false,
          errors: [result.error || "Failed to publish website"],
        };
      }
    } catch (e: any) {
      console.error(e);
      return {
        success: false,
        errors: [e.message || "Failed to publish"],
      };
    }
  }
}
export default PublishingService;

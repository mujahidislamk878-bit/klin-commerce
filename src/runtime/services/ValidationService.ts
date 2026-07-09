import { RenderContext } from "../core/RenderContext";
import { ValidationMiddleware, ValidationIssue } from "../middlewares/ValidationMiddleware";

export class ValidationService {
  public static validateContext(context: RenderContext): ValidationIssue[] {
    return ValidationMiddleware.validate(context);
  }
}
export default ValidationService;

export const ValidationService = {
  validateProps(componentType: string, props: any): { success: boolean; errors: string[] } {
    const errors: string[] = [];
    if (componentType === "Hero" && props.title && props.title.length > 200) {
      errors.push("Hero title is too long (limit 200 characters).");
    }
    return {
      success: errors.length === 0,
      errors
    };
  }
};

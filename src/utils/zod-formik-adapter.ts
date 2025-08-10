import { z } from "zod";

/**
 * Custom adapter to convert Zod schema to Formik validation schema
 * This works with Zod 4.x and Formik
 */
export function toFormikValidationSchema<T extends z.ZodTypeAny>(
  schema: T
): (values: Record<string, unknown>) => Record<string, string> | undefined {
  return (values: Record<string, unknown>) => {
    try {
      schema.parse(values);
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const fieldPath = issue.path.join(".");
          if (fieldPath) {
            fieldErrors[fieldPath] = issue.message;
          }
        });

        return fieldErrors;
      }
      return { general: "Validation failed" };
    }
  };
}

/**
 * Alternative approach: Use Zod's safeParse for better error handling
 */
export function toFormikValidationSchemaSafe<T extends z.ZodTypeAny>(
  schema: T
): (values: Record<string, unknown>) => Record<string, string> | undefined {
  return (values: Record<string, unknown>) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return undefined;
    }

    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const fieldPath = issue.path.join(".");
      if (fieldPath) {
        fieldErrors[fieldPath] = issue.message;
      }
    });

    return fieldErrors;
  };
}

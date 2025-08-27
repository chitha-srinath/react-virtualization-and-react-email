import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASEURL: z.string().regex(/^https?:\/\/.+$/),
  VITE_API_URL: z.string().regex(/^https?:\/\/.+$/),
  VITE_SECRET_KEY: z.string(),
});

// Environment validation result
interface EnvResult {
  success: boolean;
  data?: z.infer<typeof envSchema>;
  error?: string;
}

// Better error handling
function parseEnv(): EnvResult {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    const errorMessage = `Environment validation failed:\n${result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n")}\n\nPlease check your .env file.`;

    return {
      success: false,
      error: errorMessage,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export const envResult = parseEnv();
export const env = envResult.data;

export const ensureTrailingSlash = (u?: string) =>
  !u ? u : u.endsWith("/") ? u : `${u}/`;

export function getApiUrl(): string | undefined {
  if (envResult.success) return env!.VITE_API_URL;
  return import.meta.env.VITE_API_URL;
}

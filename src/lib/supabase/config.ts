import "server-only";

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISH_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error("Supabase Auth is not configured.");
  }

  return { url, publishableKey };
}

export function getAppOrigin() {
  const configured = process.env.APP_ORIGIN?.trim();
  if (!configured && process.env.NODE_ENV !== "production") return "http://localhost:3000";
  if (!configured) throw new Error("APP_ORIGIN is not configured.");

  const origin = new URL(configured);
  const localDevelopment =
    process.env.NODE_ENV !== "production" &&
    origin.protocol === "http:" &&
    origin.hostname === "localhost";
  if (origin.protocol !== "https:" && !localDevelopment) {
    throw new Error("APP_ORIGIN must use HTTPS in production.");
  }

  return origin.origin;
}

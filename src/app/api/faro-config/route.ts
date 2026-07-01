import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function faroEnv(serverName: string, publicName: string) {
  return process.env[serverName] ?? process.env[publicName] ?? "";
}

export function GET() {
  return NextResponse.json(
    {
      enabled: faroEnv("FARO_ENABLED", "NEXT_PUBLIC_FARO_ENABLED") === "true",
      url: faroEnv("FARO_URL", "NEXT_PUBLIC_FARO_URL"),
      apiKey: faroEnv("FARO_API_KEY", "NEXT_PUBLIC_FARO_API_KEY"),
      appName: faroEnv("FARO_APP_NAME", "NEXT_PUBLIC_FARO_APP_NAME") || "portfolio",
      appVersion: faroEnv("FARO_APP_VERSION", "NEXT_PUBLIC_FARO_APP_VERSION"),
      environment:
        faroEnv("FARO_ENVIRONMENT", "NEXT_PUBLIC_FARO_ENVIRONMENT") || "production",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

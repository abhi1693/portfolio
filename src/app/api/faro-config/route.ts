import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      enabled: process.env["NEXT_PUBLIC_FARO_ENABLED"] === "true",
      url: process.env["NEXT_PUBLIC_FARO_URL"] ?? "",
      apiKey: process.env["NEXT_PUBLIC_FARO_API_KEY"] ?? "",
      appName: process.env["NEXT_PUBLIC_FARO_APP_NAME"] ?? "portfolio",
      appVersion: process.env["NEXT_PUBLIC_FARO_APP_VERSION"] ?? "",
      environment: process.env["NEXT_PUBLIC_FARO_ENVIRONMENT"] ?? "production",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

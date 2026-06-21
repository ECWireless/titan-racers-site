import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

const defaultForgeSubscribeUrl = "https://forge.raidguild.org/api/subscribe";
const defaultSiteOrigin = "https://titanracers.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeRequestBody = {
  email?: unknown;
};

function getForgeSubscribeUrl() {
  return process.env.FORGE_SUBSCRIBE_URL ?? defaultForgeSubscribeUrl;
}

function getSiteOrigin() {
  return process.env.TITAN_SITE_URL ?? defaultSiteOrigin;
}

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  const body = rawBody as SubscribeRequestBody;
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!emailPattern.test(email)) {
    return jsonResponse(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(getForgeSubscribeUrl(), {
      body: JSON.stringify({
        confirmationOrigin: getSiteOrigin(),
        email,
        projectInterests: ["titan-racers"],
        source: "titan-racers-site",
      }),
      headers: {
        "Content-Type": "application/json",
        Origin: getSiteOrigin(),
      },
      method: "POST",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return jsonResponse(
        { error: "Signup is temporarily unavailable. Please try again soon." },
        { status: response.status >= 500 ? 502 : 400 },
      );
    }

    return jsonResponse({
      ok: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    console.error("Titan Racers subscribe proxy failed", error);

    return jsonResponse(
      { error: "Signup is temporarily unavailable. Please try again soon." },
      { status: 502 },
    );
  }
}

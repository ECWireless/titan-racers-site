import { NextResponse } from "next/server";

export const runtime = "nodejs";

const defaultForgeConfirmUrl =
  "https://forge.raidguild.org/api/subscribe/confirm";

type ConfirmRequestBody = {
  token?: unknown;
};

function getForgeConfirmUrl() {
  return process.env.FORGE_SUBSCRIBE_CONFIRM_URL ?? defaultForgeConfirmUrl;
}

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  const body = rawBody as ConfirmRequestBody;

  if (typeof body.token !== "string" || !body.token.trim()) {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  const token = body.token.trim();

  try {
    const response = await fetch(getForgeConfirmUrl(), {
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status >= 500) {
        return jsonResponse(
          { error: "Confirmation is temporarily unavailable." },
          { status: 502 },
        );
      }

      return jsonResponse(
        { error: "Confirmation link expired." },
        { status: 400 },
      );
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Titan Racers confirmation proxy failed", error);

    return jsonResponse(
      { error: "Confirmation is temporarily unavailable." },
      { status: 502 },
    );
  }
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import {
  describeError,
  notifyAdminOfSignup,
  sendConfirmationEmail,
} from "@/lib/updates/email";
import {
  confirmSubscriber,
  issueConfirmation,
  recordSignupAttempt,
  unsubscribeSubscriber,
  withdrawConfirmation,
} from "@/lib/updates/repository";
import { hashIp, isValidEmail, normalizeEmail } from "@/lib/updates/tokens";

const signupSource = "titan-racers-site";

export type SignupState =
  | null
  | { status: "sent" }
  | {
      status: "error";
      reason: "invalid" | "rate_limited" | "unavailable";
      // Puts the address back in the field after the form resets.
      email: string;
    };

function getSiteOrigin() {
  const configured = process.env.SITE_URL;

  if (configured) {
    return new URL(configured).origin;
  }

  return null;
}

async function getLinkOrigin() {
  const configured = getSiteOrigin();

  if (configured) {
    return configured;
  }

  // Emailed links never take their host from a request outside local
  // development, where a forged Host header could point them elsewhere.
  if (process.env.NODE_ENV === "production") {
    return "https://titanracers.com";
  }

  const host = (await headers()).get("host");

  return host ? `http://${host}` : "http://localhost:3000";
}

async function getClientIp() {
  const requestHeaders = await headers();

  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * The signup form's action. Its answer depends only on the input and the
 * rate limit, never on whether the address is on the list: emails go out
 * after the response, so its timing and any SendGrid failure stay hidden.
 */
export async function signUpForUpdates(
  _previous: SignupState,
  formData: FormData,
): Promise<SignupState> {
  // Real visitors never see the "website" field; bots that fill it in are
  // told the email went out.
  const honeypot = formData.get("website");

  if (typeof honeypot === "string" && honeypot.trim()) {
    return { status: "sent" };
  }

  const rawEmail = formData.get("email");
  const typed = typeof rawEmail === "string" ? rawEmail.slice(0, 320) : "";
  const email = normalizeEmail(typed);

  if (!isValidEmail(email)) {
    return { status: "error", reason: "invalid", email: typed };
  }

  try {
    const origin = await getLinkOrigin();

    if (!(await recordSignupAttempt(hashIp(await getClientIp())))) {
      return { status: "error", reason: "rate_limited", email: typed };
    }

    const confirmation = await issueConfirmation({ email, source: signupSource });

    if (confirmation) {
      const confirmUrl = new URL("/updates/confirm", origin);
      confirmUrl.searchParams.set("token", confirmation.confirmToken);
      const unsubscribeUrl = new URL("/updates/unsubscribe", origin);
      unsubscribeUrl.searchParams.set("token", confirmation.unsubscribeToken);

      after(async () => {
        try {
          await sendConfirmationEmail({
            to: email,
            confirmUrl: confirmUrl.toString(),
            unsubscribeUrl: unsubscribeUrl.toString(),
          });
        } catch (error) {
          console.error("Confirmation email failed", describeError(error));
          await withdrawConfirmation(confirmation).catch((withdrawError) =>
            console.error(
              "Withdrawing a failed confirmation failed",
              describeError(withdrawError),
            ),
          );
          return;
        }

        await notifyAdminOfSignup({ email, source: signupSource });
      });
    }

    return { status: "sent" };
  } catch (error) {
    console.error("Updates signup failed", describeError(error));
    return { status: "error", reason: "unavailable", email: typed };
  }
}

export async function confirmFromForm(formData: FormData) {
  const token = formData.get("token");
  let result: "success" | "expired" | "unavailable" = "expired";

  if (typeof token === "string" && token.trim()) {
    try {
      result = (await confirmSubscriber(token.trim())) ? "success" : "expired";
    } catch (error) {
      console.error("Updates confirmation failed", describeError(error));
      result = "unavailable";
    }
  }

  redirect(`/updates/confirm?result=${result}`);
}

export async function unsubscribeFromUpdates(formData: FormData) {
  const token = formData.get("token");
  let result: "success" | "expired" | "unavailable" = "expired";

  if (typeof token === "string" && token.trim()) {
    try {
      result = (await unsubscribeSubscriber(token.trim())) ? "success" : "expired";
    } catch (error) {
      console.error("Updates unsubscribe failed", describeError(error));
      result = "unavailable";
    }
  }

  redirect(`/updates/unsubscribe?result=${result}`);
}

import { createHash, createHmac, randomBytes } from "node:crypto";

// Rejects the characters mail libraries treat as display-name or list syntax
// ("Name <a@b.c>", commas), so one inbox can't hide behind many spellings.
const emailPattern =
  /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)*\.[a-z0-9-]{2,}$/i;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return email.length <= 254 && emailPattern.test(email);
}

/**
 * A keyed hash of an IP address, for rate limiting. Without the key, the hash
 * of an IPv4 address could be reversed by trying them all.
 */
export function hashIp(ip: string) {
  const secret = process.env.IP_HASH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("IP_HASH_SECRET is required for the updates list.");
    }

    return createHash("sha256").update(`dev:${ip}`).digest("hex");
  }

  return createHmac("sha256", secret).update(ip).digest("hex");
}

export function createToken() {
  return randomBytes(32).toString("base64url");
}

// Only hashes are stored, so a database leak exposes no working links. This
// matches the RaidGuild Forge list's hashing, so imported unsubscribe links
// keep working.
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export const ADMIN_SESSION_COOKIE = "luma_admin_session";

type AdminSessionPayload = {
  email: string;
  expiresAt: number;
};

const encoder = new TextEncoder();

function base64UrlEncodeBytes(bytes: Uint8Array) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlEncodeText(value: string) {
  return base64UrlEncodeBytes(encoder.encode(value));
}

function base64UrlDecodeText(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const base64 = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function constantTimeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

export function getAdminSessionMaxAgeSeconds() {
  const maxAge = Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS);

  if (Number.isFinite(maxAge) && maxAge > 0) {
    return maxAge;
  }

  return 60 * 60 * 8;
}

export async function createAdminSessionToken(
  email: string,
  secret: string,
  maxAgeSeconds = getAdminSessionMaxAgeSeconds(),
) {
  const payload: AdminSessionPayload = {
    email,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  };
  const encodedPayload = base64UrlEncodeText(JSON.stringify(payload));
  const signature = await sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string, secret: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await sign(encodedPayload, secret);

  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      base64UrlDecodeText(encodedPayload),
    ) as AdminSessionPayload;

    if (!payload.email || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

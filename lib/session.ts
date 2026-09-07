export const SESSION_COOKIE_NAME = "balaji_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24;

export interface SessionPayload {
  adminId: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
}

function getSecretKey(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  return "balaji_motors_secure_fallback_session_secret_key_32_bytes";
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const secretBytes = enc.encode(getSecretKey());
  return crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSession(admin: { id: string; email: string; role?: "admin" }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    adminId: admin.id,
    email: admin.email,
    role: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };

  const enc = new TextEncoder();
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(enc.encode(payloadJson));

  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const signatureB64 = base64UrlEncode(signatureBuffer);

  return `${payloadB64}.${signatureB64}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;
  const enc = new TextEncoder();

  try {
    const key = await getHmacKey();
    const expectedSigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
    const expectedSigB64 = base64UrlEncode(expectedSigBuffer);

    if (signatureB64 !== expectedSigB64) return null;

    const json = base64UrlDecode(payloadB64);
    const payload = JSON.parse(json) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "./db";
import { AdminUserRecord } from "./db/types";

export const SESSION_COOKIE_NAME = "balaji_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24;

interface SessionPayload {
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

export function createSessionToken(admin: AdminUserRecord): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    adminId: admin.id,
    email: admin.email,
    role: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payloadB64)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) return null;
  const match = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!match) return null;

  try {
    const raw = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(raw) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUserRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await getAdminByEmail(normalizedEmail);

  if (admin) {
    const isValid = await comparePassword(password, admin.passwordHash);
    if (isValid) return admin;
  }

  const envEmail = (process.env.ADMIN_EMAIL || "balajimotors.etawah@gmail.com").trim().toLowerCase();
  if (normalizedEmail === envEmail) {
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    if (envHash) {
      const isValid = await comparePassword(password, envHash);
      if (isValid) {
        return {
          id: "admin_env_1",
          email: envEmail,
          passwordHash: envHash,
          name: "Balaji Motors Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      const envRawPass = process.env.ADMIN_PASSWORD || "BalajiAdmin@2026!";
      if (password === envRawPass) {
        return {
          id: "admin_env_1",
          email: envEmail,
          passwordHash: await hashPassword(envRawPass),
          name: "Balaji Motors Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}
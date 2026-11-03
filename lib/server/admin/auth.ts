import "server-only";

import { createHmac, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminPrisma } from "@/lib/server/prisma";

const SESSION_COOKIE = "sf_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_PASSWORD_LENGTH = 200;

type AdminConfig = { passwordHash: string; sessionSecret: string };

function getAdminConfig(): AdminConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!passwordHash || !sessionSecret || sessionSecret.length < 32) return null;
  return { passwordHash, sessionSecret };
}

export function isAdminConfigured() {
  return getAdminConfig() !== null && Boolean(process.env.ADMIN_DATABASE_URL);
}

function scryptAsync(password: string, salt: Buffer, keyLength: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

// Hash written by the setup script: "scrypt:<N>:<r>:<p>:<salt>:<hash>" (base64url parts,
// no "$" because Next.js expands "$" in .env files).
async function verifyPassword(password: string, storedHash: string) {
  const [scheme, n, r, p, salt, hash] = storedHash.split(":");
  const cost = Number(n);
  const blockSize = Number(r);
  const parallelization = Number(p);
  if (scheme !== "scrypt" || !salt || !hash || ![cost, blockSize, parallelization].every(Number.isSafeInteger)) {
    return false;
  }

  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length, {
    N: cost,
    r: blockSize,
    p: parallelization,
    maxmem: 256 * cost * blockSize,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// The password hash is part of the signature, so changing the password ends every session.
function signSession(expiresAt: number, config: AdminConfig) {
  return createHmac("sha256", config.sessionSecret)
    .update(`admin:${expiresAt}:${config.passwordHash}`)
    .digest("base64url");
}

export async function isAdminSession() {
  const config = getAdminConfig();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!config || !token) return false;

  const [expiresText, signature] = token.split(".");
  const expiresAt = Number(expiresText);
  if (!signature || !Number.isSafeInteger(expiresAt) || expiresAt * 1000 < Date.now()) return false;

  const expected = Buffer.from(signSession(expiresAt, config));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Call at the top of every admin page and Server Action. */
export async function requireAdmin() {
  if (!(await isAdminSession())) redirect("/admin/connexion");
}

async function getClientIp() {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-nf-client-connection-ip")
    ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]
    ?? "unknown";
  return ip.trim().slice(0, 64) || "unknown";
}

export type SignInResult = "ok" | "invalid" | "locked" | "unconfigured";

export async function signIn(password: string): Promise<SignInResult> {
  const config = getAdminConfig();
  if (!config || !process.env.ADMIN_DATABASE_URL) return "unconfigured";

  const prisma = getAdminPrisma();
  const ip = await getClientIp();
  const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MS);
  await prisma.adminLoginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
  const recentFailures = await prisma.adminLoginAttempt.count({ where: { ip, createdAt: { gte: windowStart } } });
  if (recentFailures >= MAX_FAILED_ATTEMPTS) return "locked";

  const valid = password.length > 0
    && password.length <= MAX_PASSWORD_LENGTH
    && await verifyPassword(password, config.passwordHash);
  if (!valid) {
    await prisma.adminLoginAttempt.create({ data: { ip } });
    await new Promise((resolve) => setTimeout(resolve, 750));
    return "invalid";
  }

  await prisma.adminLoginAttempt.deleteMany({ where: { ip } });
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  (await cookies()).set(SESSION_COOKIE, `${expiresAt}.${signSession(expiresAt, config)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return "ok";
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
}

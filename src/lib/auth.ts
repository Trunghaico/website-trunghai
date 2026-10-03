// Web Crypto based authentication utilities (universal support for Node.js and Cloudflare Workers)
const AUTH_SECRET = process.env.AUTH_SECRET || "trunghai_secret_key_super_secure_2026_jwt";
const SALT = "trunghai_salt_2026";

/**
 * Hash a plain password using SHA-256 with project salt
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${SALT}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compare plain password against stored SHA-256 hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash.toLowerCase() === storedHash.toLowerCase();
}

export interface SessionPayload {
  id: string;
  username: string;
  name: string;
  role: string;
  exp: number;
}

/**
 * Create a signed session token
 */
export async function createSessionToken(user: { id: string; username: string; name: string; role: string }): Promise<string> {
  const payload: SessionPayload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };

  const jsonStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(jsonStr).toString("base64url");

  // Sign payload with AUTH_SECRET
  const enc = new TextEncoder();
  const data = enc.encode(`${payloadBase64}.${AUTH_SECRET}`);
  const sigBuffer = await crypto.subtle.digest("SHA-256", data);
  const sig = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${payloadBase64}.${sig}`;
}

/**
 * Verify and decode session token
 */
export async function verifySessionToken(token?: string | null): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const [payloadBase64, sig] = token.split(".");
    if (!payloadBase64 || !sig) return null;

    // Verify signature
    const enc = new TextEncoder();
    const data = enc.encode(`${payloadBase64}.${AUTH_SECRET}`);
    const expectedSigBuffer = await crypto.subtle.digest("SHA-256", data);
    const expectedSig = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (sig.toLowerCase() !== expectedSig.toLowerCase()) return null;

    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;

    if (!payload.exp || Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

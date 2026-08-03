import type { UserSession } from "@/lib/types";

const SESSION_COOKIE_NAME = "ummah-reads-session";

function encodeBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64url");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function encodeSession(session: UserSession) {
  return encodeBase64Url(JSON.stringify(session));
}

export function decodeSession(rawValue?: string | null): UserSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const json = decodeBase64Url(rawValue);
    return JSON.parse(json) as UserSession;
  } catch {
    return null;
  }
}

export function sanitizeSession(session: UserSession): UserSession {
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role,
    track: session.track,
    isApproved: session.isApproved,
    centerId: session.centerId ?? null
  };
}

export { SESSION_COOKIE_NAME };

import { getServerSession } from "next-auth";
import { authOptions, hasPermission } from "@/lib/auth";
import type { PermissionKey } from "@prisma/client";

/**
 * Every admin mutation calls this first. Returns the session on success,
 * or null when the caller lacks the permission — callers should treat a
 * null return as "reject the mutation", never trust the client alone.
 */
export async function requireAdmin(permission?: PermissionKey) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).accountType !== "admin") return null;
  if (permission && !hasPermission(session, permission)) return null;
  return session;
}

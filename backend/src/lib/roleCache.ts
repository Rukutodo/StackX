import { Role } from "../models/Role";

/**
 * Small in-memory cache mapping role slug -> permissions.
 * Lets `protect` resolve a user's permissions live (so editing a role's
 * permissions takes effect within the TTL) without a DB hit per request.
 */
let cache: Map<string, string[]> | null = null;
let loadedAt = 0;
const TTL = 30_000; // 30s

async function refresh(): Promise<Map<string, string[]>> {
  const roles = await Role.find().select("slug permissions").lean();
  cache = new Map(roles.map((r) => [r.slug, r.permissions as string[]]));
  loadedAt = Date.now();
  return cache;
}

export async function getRolePermissions(slug: string): Promise<string[]> {
  if (!cache || Date.now() - loadedAt > TTL) {
    await refresh();
  }
  return cache!.get(slug) ?? [];
}

/** Call after any role mutation so changes are reflected immediately. */
export function invalidateRoleCache(): void {
  cache = null;
}

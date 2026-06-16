import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getRolePermissions } from "../lib/roleCache";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretfallbackkey";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  name?: string;
  /** Resolved live from the user's role at request time. */
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role?: string;
      name?: string;
    };
    const role = decoded.role || "developer";
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role,
      name: decoded.name,
      permissions: await getRolePermissions(role),
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/** True if the authed user holds the given permission. */
export const can = (req: AuthRequest, permission: string): boolean =>
  !!req.user?.permissions?.includes(permission);

/**
 * Guard requiring ALL listed permissions. Use after `protect`.
 *   router.post("/", protect, requirePermission("roles.manage"), handler)
 */
export const requirePermission =
  (...permissions: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const ok = permissions.every((p) => req.user!.permissions.includes(p));
    if (!ok) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };

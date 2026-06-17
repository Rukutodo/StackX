import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretfallbackkey";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
    permissions: string[];
    managerId: string | null;
  };
}

function extractToken(req: Request): string | null {
  return (
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null)
  );
}

/** Verify JWT, load the user + their role, and attach the flattened permission set. */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).populate("roleId");
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Account not found or inactive" });
    }

    const role = user.roleId as unknown as { _id: string; name: string; permissions: string[] };
    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      roleId: String(role._id),
      roleName: role.name,
      permissions: role.permissions || [],
      managerId: user.managerId ? String(user.managerId) : null,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/** Guard a route by one or more permission keys (user needs ANY of them). */
export const authorize =
  (...required: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    const has = required.some((p) => req.user!.permissions.includes(p));
    if (!has) return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };

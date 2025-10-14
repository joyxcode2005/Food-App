import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

// Middleware to authenticate the admin properly
export default function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the token from the cookies or headers
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded?.adminId)
      return res.status(401).json({ message: "Invalid token" });

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}


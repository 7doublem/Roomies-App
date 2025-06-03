import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
    return;
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
  return;
}

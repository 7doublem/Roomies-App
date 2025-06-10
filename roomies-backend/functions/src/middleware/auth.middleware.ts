import {Request, Response, NextFunction} from "express";
import {getAuth} from "firebase-admin/auth";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({message: "Unauthorised"});
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);

    req.user = {uid: decodedToken.uid};

    next();
    return;
  } catch (error: any) {
    res.status(401).json({message: "Unauthorised", error: error.message});
    return;
  }
};

import User from "../models/User.js";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
      };
    }
  }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization?.split(" ")[1];

    const token = cookieToken || headerToken;
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("_id username email");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user.id.toString(), username: user.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", err });
  }
};

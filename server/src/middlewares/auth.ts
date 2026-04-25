import UserModal from "../models/User.js";
import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import "express";

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      username?: string;
      email?: string;
      avatar?: string;
    };
  }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await UserModal.findById(decoded.id)
      .select("_id username email avatar");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: String(user._id),
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
    };


    next();
  } catch (err) {
    console.error("JWT Validation Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

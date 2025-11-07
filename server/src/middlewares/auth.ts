import UserModal from "../models/User.js";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import "express";

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    User?: {
      id: string;
      username?: string;
    };
  }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.header("Authorization")?.split(" ")[1];
    // console.log(cookieToken, " ",headerToken);

    // console.log(cookieToken, req.route);
    //  console.log(headerToken);

    const token = cookieToken || headerToken;
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await UserModal.findById(decoded.id).select("_id username email");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.User = { id: user.id.toString(), username: user.username };
    next();
  } catch (err: unknown) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or expired token", err });
  }
};

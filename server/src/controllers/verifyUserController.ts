import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  console.log('Im in verify User ');
  
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
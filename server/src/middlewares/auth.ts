import User from "../models/User.js";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                username: string
            }
        }
    }
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if(!token) {
            res.status(401).json({message: 'Token is missing'});
        }
        if(!process.env.JWT_SECRET) {
            return res.status(500).json({message: 'JWT Secret is missing'});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET) as JwtPayload;

        req.user = {id: decoded.id, username:decoded.username};
        next();
    }catch(err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
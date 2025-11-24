import type { Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import {
  ForgetPasswordController,
  LoginController,
  LogoutController,
  ResetPasswordController,
  SignupController,
} from "../controllers/authController.js";
import passport from "../utils/passport.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET ?? "";

interface JwtUser {
  _id: string;
  username?: string | undefined;
}

function setJwtCookie(res: Response, user: JwtUser) {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path:"/",
    // domain: ".madebyadam.xyz",
  });
}

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/`,
    session: false,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) return res.redirect(`${FRONTEND_URL}/?error=no_user`);
    setJwtCookie(res, { _id: user.id, username: user.username });
    res.redirect(`${FRONTEND_URL}/home/dashboard`);
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${FRONTEND_URL}/`,
    session: false,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) return res.redirect(`${FRONTEND_URL}/?error=no_user`);
    setJwtCookie(res, { _id: user.id, username: user.username });
    res.redirect(`${FRONTEND_URL}/home/dashboard`);
  }
);

router.post("/signup", SignupController);
router.post("/login", LoginController);
router.post("/forgot-password", ForgetPasswordController);
router.post("/reset-password", ResetPasswordController);
router.post("/logout", LogoutController);

export default router;

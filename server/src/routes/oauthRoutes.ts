// routes/oauthRoutes.ts
import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import type { Response } from "express";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET!;

function setJwtCookie(res: Response, user: any) {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/`,
    session: false, // 👈 disables session storage
  }),
  (req: any, res) => {
    setJwtCookie(res, req.user);
    res.redirect(`${FRONTEND_URL}/home/dashboard`);
  }
);



router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${FRONTEND_URL}/`,
    session: false, // 👈 add this here too
  }),
  (req: any, res) => {
    setJwtCookie(res, req.user);
    res.redirect(`${FRONTEND_URL}/home/dashboard`);
  }
);

export default router;

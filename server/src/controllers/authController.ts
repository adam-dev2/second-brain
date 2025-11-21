import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import UserModal from "../models/User.js";
import { signupSchema, loginSchema } from "../validations/AuthSchema.js";
import nodemailer from "nodemailer";

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  sameSite: "strict" | "lax" | "none";
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const SignupController = async (req: Request, res: Response) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation) {
    return res.status(400);
  }
  const username = validation.data?.username;
  const email = validation.data?.email;
  const password = validation.data?.password;
  if (!username || !email || !password) {
    return res.status(411).json({ message: "All feilds are required" });
  }

  try {
    let findUser = await UserModal.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    findUser = new UserModal({ username, email, password: hashedPassword });
    await findUser.save();
    if (!process.env.JWT_SECRET || !process.env.NODE_ENV) {
      return res.status(500).json({ message: "There's a missing env objects" });
    }
    const token = jwt.sign(
      {
        id: findUser._id,
        username: findUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // const cookieOptions: CookieOptions = {
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 60 * 60 * 1000,
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // };
    // console.log(token);

    // res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "User created successfully", username, email });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({
        message: "Invalid input",
        errors: err,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      details: err instanceof Error ? err.message : err,
    });
  }
};

export const LoginController = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation) {
    return res.status(400);
  }
  const email = validation.data?.email;
  const password = validation.data?.password;
  if (!email || !password) {
    return res.status(411).json({ message: "All Fields are required" });
  }
  try {
    const findUser = await UserModal.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "User with this email doesn't exists" });
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    if (!process.env.JWT_SECRET || !process.env.NODE_ENV) {
      return res.status(500).json({ message: "There's a missing env objects" });
    }
    const token = jwt.sign(
      {
        id: findUser._id,
        username: findUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const cookieOptions: CookieOptions = {
      // httpOnly: process.env.NODE_ENV === "production",
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "none",
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({
        message: "Invalid input",
        errors: err,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
      details: err instanceof Error ? err.message : err,
    });
  }
};

export const ForgetPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(email);

  try {
    const findUser = await UserModal.findOne({ email });
    if (!findUser) {
      return res.status(401).json({ message: "User with this email doesn't exist" });
    }
    const token = jwt.sign({ id: findUser._id }, process.env.RESET_SECRET!, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Second Brain" ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

export const ResetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.RESET_SECRET!) as { id: string };
    const user = await UserModal.findById(decoded.id);
    console.log(user?.username);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "new Password is required" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    console.log(hashedPassword);

    await user.save();
    return res.status(200).json({ message: "Password reset succesfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const LogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

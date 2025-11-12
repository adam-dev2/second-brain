import type { Request, Response } from "express";
import UserModal from "../models/User.js";
import bcrypt from "bcrypt";

export const FetchUser = async (req: Request, res: Response) => {
  const userId = req.User?.id;
  if (!userId) {
    return res.status(401).json({ message: "UnAuthroized" });
  }
  try {
    const findUser = await UserModal.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "No User Found" });
    }
    const userProfile = {
      username: findUser.username,
      email: findUser.email,
      avatar: findUser.avatar,
    };
    res.status(200).json({ userProfile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

export const FetchUserDetails = async (req: Request, res: Response) => {
  const id = req.User?.id;
  const { password } = req.body;
  if (!id) {
    return res.status(401).json({ message: "UnAuthroized" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please enter the current password" });
  }
  try {
    const findUser = await UserModal.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User with this email doesn't exists" });
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    return res.status(200).json({ message: "User password confirmed" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

export const FetchProfile = async (req: Request, res: Response) => {
  const userId = req.User?.id;
  const { username, email, password, avatar } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "UnAuthroized" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ message: "Please enter the current password in the password section" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const findUser = await UserModal.findByIdAndUpdate(userId, {
      username,
      email,
      password: hashedPassword,
      avatar,
      updatedAt: new Date().toISOString(),
    });
    const userProfile = {
      username: findUser?.username,
      email: findUser?.email,
    };
    return res
      .status(200)
      .json({ message: "User profile updated successfully", userProfile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

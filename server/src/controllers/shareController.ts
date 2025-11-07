import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import UserModal from "../models/User.js";
import Content from "../models/Content.js";

export const ShareBrain = async (req: Request, res: Response) => {
  try {
    const userID = req.User?.id;
    if (!userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "jwt secret not found" });
    }
    const shareHash = nanoid();
    await UserModal.findByIdAndUpdate(userID, {
      sharelink: `${shareHash}`,
    });

    return res
      .status(200)
      .json({ message: "Sharelink Generated Successfully", ShareableLink: `${shareHash}` });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

export const GetShareBrain = async (req: Request, res: Response) => {
  try {
    const { shareLink } = req.params;
    if (!shareLink) {
      return res.status(400).json({ message: "sharelink is required" });
    }
    const findUser = await UserModal.findOne({ sharelink: shareLink });
    if (!findUser) {
      return res.status(404).json({ message: "Can't find user" });
    }
    const findCards = await Content.find({ userId: findUser.id, share: true });
    res.clearCookie("token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.status(200).json({ ShareableCards: findCards });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

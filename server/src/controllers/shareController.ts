import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import UserModal from "../models/User.js";
import Content from "../models/Content.js";

export const ShareBrain = async (req: Request, res: Response) => {
  try {
    const userID = req.user?.id;
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!shareLink) {
      return res.status(400).json({ message: "sharelink is required" });
    }

    const maxLimit = 100;
    const finalLimit = Math.min(limit, maxLimit);
    const skip = (page - 1) * finalLimit;

    const findUser = await UserModal.findOne({ sharelink: shareLink });
    if (!findUser) {
      return res.status(404).json({ message: "Can't find user" });
    }

    const [cards, totalCards] = await Promise.all([
      Content.find({ userId: findUser.id, share: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(finalLimit)
        .lean(),

      Content.countDocuments({ userId: findUser.id, share: true })
    ]);

    const totalPages = Math.ceil(totalCards / finalLimit);

    res.clearCookie("token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      ShareableCards: cards,
      pagination: {
        totalCards,
        totalPages,
        currentPage: page,
        limit: finalLimit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

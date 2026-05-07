import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import UserModal from "../models/User.js";
import { ShareModel } from "../models/Share.js";
import Content, { IContent } from "../models/Content.js";

export const ShareBrain = async (req: Request, res: Response) => {
  const { sectionId = null } = req.body;
  
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "jwt secret not found" });
    }
    const shareHash = nanoid();
    const CreateShare = new ShareModel({
      userId,
      shareHash,
      sectionId,
    });

    await CreateShare.save();

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

    const findShareHash = await ShareModel.findOne({ shareHash: shareLink });
    if (!findShareHash) {
      return res.status(404).json({
        message: "Invalid share link",
      });
    }
    const userId = findShareHash.userId;
    const sectionId = findShareHash.sectionId;
    
    let sharedCards: IContent[] = [];

    if (sectionId !== null) {
      sharedCards = await Content.find({
        userId,
        sectionId,
        share: true,
      });
    } else {
      sharedCards = await Content.find({
        userId,
        share: true,
      });
    }

    if (sharedCards.length === 0) {
      return res.status(200).json({
        message: "No Bookmarks available",
        cards: [],
      });
    }

    return res.status(200).json({
      message: "fetched bookmarks successfully",
      cards: sharedCards,
      totalCards: sharedCards.length,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

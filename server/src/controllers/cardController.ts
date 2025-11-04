import type {Request,Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import { getEmbedding } from '../utils/embeddings.js';
import { COLLECTION_NAME, qdrantClient } from '../utils/qDrant.js';
import Content from '../models/Content.js';
import { processCard } from "../services/processor.js";

interface IAllCards {
    userId:string;
    link: string;
    title: string;
    type: string;
    tags:string[];
    share:boolean;
    embedding?:number[];
    cardId:string;
    createdAt:Date;
    updatedAt:Date;
}

export const FetchMetrics = async(req:Request,res:Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); 
        startOfWeek.setHours(0, 0, 0, 0);

        const totalCards = await Content.countDocuments({ userId });
        const cardsLastWeek = await Content.countDocuments({
            userId,
            createdAt: { $gte: fourteenDaysAgo.toISOString(), $lt: sevenDaysAgo.toISOString() }
        });
        const cardsThisWeek = await Content.countDocuments({
            userId,
            createdAt: { $gte: sevenDaysAgo.toISOString() }
        });
        const cardsBeforeLastWeek = totalCards - cardsThisWeek;
        const cardsChangePercent = cardsBeforeLastWeek > 0 
            ? Number(((cardsThisWeek / cardsBeforeLastWeek) * 100).toFixed(1))
            : 0;
        const allCards = await Content.find({ userId }, { tags: 1 });
        const uniqueTags = new Set<string>();
        allCards.forEach(card => {
            card.tags?.forEach((tag: string) => uniqueTags.add(tag));
        });
        const totalTags = uniqueTags.size;
        const oldCards = await Content.find({
            userId,
            createdAt: { $lt: sevenDaysAgo.toISOString() }
        }, { tags: 1 });
        const oldUniqueTags = new Set<string>();
        oldCards.forEach(card => {
            card.tags?.forEach((tag: string) => oldUniqueTags.add(tag));
        });
        const tagsChange = totalTags - oldUniqueTags.size;


        const Allcards:IAllCards[] = await Content.find({userId})
        const sharedCards = Allcards.filter(item => item.share === true).length


        const aiSearches = sharedCards
        const searchesChange = -3.2;
        const weeklyActivity = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            const cardsCount = await Content.countDocuments({
                userId,
                createdAt: { 
                    $gte: dayStart.toISOString(), 
                    $lte: dayEnd.toISOString() 
                }
            });
            
            weeklyActivity.push({
                day: days[dayStart.getDay()],
                cards: cardsCount
            });
        }
        const tagCount: { [key: string]: number } = {};
        allCards.forEach(card => {
            card.tags?.forEach((tag: string) => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });

        const topTags = Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count], index) => {
                const colors = [
                    'bg-blue-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-purple-500',
                    'bg-pink-500'
                ];
                return {
                    name,
                    count,
                    color: colors[index]
                };
            });
        const recentCards = await Content.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title type tags createdAt link');

        const formattedRecentCards = recentCards.map(card => {
            const createdDate = new Date(card.createdAt);
            const diffMs = now.getTime() - createdDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let createdAt;
            if (diffMins < 60) {
                createdAt = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
            } else if (diffHours < 24) {
                createdAt = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else {
                createdAt = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            }

            return {
                id: card._id,
                title: card.title,
                type: card.type,
                tags: card.tags,
                createdAt
            };
        });

        const metrics = {
            stats: {
                totalCards,
                cardsChangePercent,
                tags: totalTags,
                tagsChange,
                aiSearches,
                searchesChange,
                thisWeek: cardsThisWeek
            },
            weeklyActivity,
            topTags,
            recentCards: formattedRecentCards
        };

        return res.status(200).json({ metrics });
    } catch (err) {
        console.error('Error fetching metrics:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
}

export const createCard = async (req: Request, res: Response) => {
  const { link, title, type, share, tags } = req.body;

  if (!link || !title || !type || !tags?.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userID = req.user?.id;
    if (!userID) return res.status(401).json({ message: "Unauthorized" });

    const qdrantID = uuidv4();

    // --- 1️⃣ Store card first (fast response)
    const newCard = new Content({
      userId: userID,
      cardId: qdrantID,
      link,
      title,
      type,
      tags,
      share,
      status: "pending", // mark as pending until embeddings ready
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await newCard.save();

    // --- 2️⃣ Fire and forget background task (non-blocking)
    processCard(qdrantID,userID, title, link)
      .then(() => console.log(`[bg] Process done for ${qdrantID}`))
      .catch((err:any) => console.error(`[bg] Failed to process ${qdrantID}`, err));

    // --- 3️⃣ Return fast response to user
    return res.status(201).json({
      message: "Card created successfully (processing in background)",
      card: newCard,
    });
  } catch (err) {
    console.error("Error creating card:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const EditCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { link, title, share, tags } = req.body;
    const userID = req.user?.id!;

    if (!link || !title || !tags?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findCard = await Content.findById(id);
    if (!findCard) return res.status(404).json({ message: "Card not found" });

    const currentUserId = req.user?.id;
    if (findCard.userId.toString() !== currentUserId)
      return res.status(403).json({ message: "Unauthorized to edit this card" });

    // Update base data first
    const updatedCard = await Content.findByIdAndUpdate(
      id,
      {
        link,
        title,
        share,
        tags,
        status: "pending", // reprocess again
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );

    // Fire async reprocessing in background
    processCard(findCard.cardId,userID, title, link)
      .then(() => console.log(`[bg] Reprocessed ${findCard.cardId}`))
      .catch((err) => console.error(`[bg] Failed reprocess ${findCard.cardId}`, err));

    return res.status(200).json({
      message: "Card updated successfully (reprocessing in background)",
      card: updatedCard,
    });
  } catch (err: any) {
    console.error("Error updating card:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const Query = async(req:Request,res:Response) => {
    const query = req.body.query;
    let limit = req.body.limit;
    
    if (!query ) {
        return res.status(400).json({ message: "query missing" });
    }
    if(!limit) {
        limit = 1;
    }
    console.log(limit);
    
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const queryEmbeddings = await getEmbedding(query);
        
        const searchResults = await qdrantClient.search(COLLECTION_NAME, {
            vector: queryEmbeddings,
            limit: parseInt(limit),
            filter: {
                must: [
                    {
                        key: "userId",
                        match: { value: userID }
                    }
                ]
            }
        });

        const titles: any = [];
        searchResults.forEach((res) => {
            if (res.payload?.title) {
                titles.push(res.payload.title);
            }
        });
        
        console.log('Found titles:', titles);
        const queryCards = await Content.find({ 
            title: { $in: titles },
            userId: userID 
        });
        const titleScoreMap = new Map();
        searchResults.forEach(res => {
            if (res.payload?.title) {
                titleScoreMap.set(res.payload.title, res.score);
            }
        });
        const cardsWithScores = queryCards.map(card => ({
            ...card.toObject(),
            relevanceScore: titleScoreMap.get(card.title) || 0
        })).sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        return res.status(200).json({ 
            queryCards: cardsWithScores,
            limit
        });
    } catch (err: any) {
        console.error('Error querying cards:', err);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            details: err.message || err 
        });
    }
}

export const FetchAllCards = async(req:Request,res:Response) => {
    try{
        const userID = req.user?.id;
        
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const FetchContent = await Content.find({userId:userID});
        if(!FetchContent) {
            return res.status(404).json({message:"no cards to show"});
        }
        return res.status(200).json({message:"Fetched cards successfully",cards:FetchContent});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
}

export const DeleteCard = async(req:Request,res:Response) => {
    const {id} = req.params;
    try{
        const findCard = await Content.findByIdAndDelete(id);
        if(!findCard) {
            return res.status(404).json({message:"There's no card to delete"});
        }
        await qdrantClient.delete("Card",{
            points:[findCard.cardId]
        })
        return res.status(200).json({message:"Card delete Successfilly"});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
}


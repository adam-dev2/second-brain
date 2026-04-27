import type { Request, Response } from "express";
import { Section } from "../models/Section.js";
import { ObjectId } from "mongoose";
import Content from "../models/Content.js";
import { DeleteCard } from "./cardController.js";


const handleError = (res:Response,err:any) => {
    console.log(err);
    return res.status(500).json({message:'Internal Server Error'})
}

const handleUserId = (req:Request,res:Response) => {
    const userID = req.user?.id;    
    if (!userID) return res.status(401).json({ message: "Unauthorized" });
}

const handleMessage = (res:Response,status:number,message:Object|string) => {
    if(typeof message === "string"){
        return res.status(status).json({message})
    }
    return res.status(status).json(message)
}

const deleteCard = async(userId:string,cardId:string) => {
    return Content.findOneAndDelete({_id:cardId,userId})
}

export const createSection = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const {name} = req.body;
    const userId = req.user?.id;
    console.log(userId);
    
    if(!name) {
        handleMessage(res,400,"Title is requried");
    }

    try{
        const newSection = new Section({userId:userId,name:name});
        await newSection.save();
        const parseSectionInformation = {
            id:newSection._id,
            path:`/home/sections/${newSection._id}`,
            label:newSection.name
        }
        handleMessage(res,201,{
            message:"New Section Created",
            section:parseSectionInformation
        })
    }catch(err) {
        handleError(res,err)
    }
}

export const getSections = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const userId = req.user?.id;
    try{
        const fetchAllSections = await Section.find({userId});
        const parseInformation = fetchAllSections.map((section) => {    
            return {
                id: section._id,
                label:section.name,
                path:`/home/sections/${section._id}`,
                createdAt:section.createdAt,
                updatedAt:section.updatedAt
            }
        })
        handleMessage(res,200,{
            message:'fetched sections successfully',
            totalSections:fetchAllSections.length,
            sections:parseInformation
        })
    }catch(err) {
        handleError(res,err)
    }
}

export const updateSectionbyId = async(req:Request,res:Response) => {
    handleUserId(req,res);
    const userId = req.user?.id;
    const sectionId = req.params.id;
    const newName = req.body.name;
    if(!sectionId) {
        handleMessage(res,400,"Section Id Missing")
    }
    if(!newName) {
        handleMessage(res,400,"Udpated Name is Missing")
    }
    try{
        const updateSection = await Section.findOneAndUpdate(
            { _id: sectionId,userId},
            {$set:{name:newName}},
            {new:true}
        );
        handleMessage(res,200,{
            message:"updated section name",
            udpatedSection: updateSection
        })
    }catch(err) {
        handleError(res,err)
    }
}

export const deleteSectionById = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const userId = req.user?.id;
    const sectionId = req.params.id;
    if(!sectionId) {
        handleMessage(res,400,"Section Id Missing")
    }
    try{
        const findSection = await Section.findOne({_id:sectionId});
        if(!findSection) {
            handleMessage(res,400,"Section not found");
        }
        const findCards = await Content.find({sectionId});
        findCards.forEach(card => {
            Content.findByIdAndUpdate(
                {_id:card._id,userId,sectionId},
                {$set:{sectionId:null}},
                {new:true}
            )
        })
        
        const deletedSection = await Section.findOneAndDelete({
            _id: sectionId,
            userId,
        });

        handleMessage(res,200,"Section Deleted Succesfully")
    }catch(err) {
        handleError(res,err)
    }
}

export const singleCardMove = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const {sectionId,cardId} = req.body;
    const userId = req.user?.id;
    if(!sectionId || !cardId){
        handleMessage(res,400,"sectionId and cardId both are required");
    }
    try{
        const verifySection = await Section.find({_id:sectionId,userId});
        if(!verifySection) {
            handleMessage(res,404,"section with this id not found");
        }

        console.log(verifySection.length);
        const updateCard = await Content.findOneAndUpdate(
            { _id: cardId, userId },
            {$set:{sectionId}},
            {new:true}
        )
        if(!updateCard) {
            handleMessage(res,400,"Card with this ID not found");
        }

        handleMessage(res,200,"moved card succesfully")
    }catch(err) {
        handleError(res,err)
    }
}

export const fetchSectionCardsbyId = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const sectionId = req.params.id;
    const userId = req.user?.id
    if(!sectionId) {
        handleMessage(res,400,"Section Id is required")
    }
    try{
        const findSectionName = await Section.findById(sectionId);
        if(!findSectionName) {
            handleMessage(res,400,"section id not found");
        }


        const findSectionCards = await Content.find({
            sectionId,
            userId
        })
        const parseInformation = findSectionCards.map((card) => {
            return {
                id:card._id,
                title:card.title,
                link:card.link,
                tags:card.tags,
                share:card.share,
                sectionId:card.sectionId,
                createdAt:card.createdAt,
                updatedAt:card.updatedAt
            }
        })
        console.log(parseInformation);
        
        handleMessage(res,200,{
            message:"fetched section cards succesfully",
            sectionname:findSectionName?.name,
            cards:parseInformation
        })
    }catch(err) {
        handleError(res,err)
    }
}

export const deleteSectionWithCards = async(req:Request,res:Response) => {
    const {sectionId,cardIds = []} = req.body;
    const userId = req.user?.id!
    if(!sectionId) {
        handleMessage(res,400,"Both SectionId and CardId's are required");
    }
    try {
        const findSectionandDelete = await Section.findByIdAndDelete(sectionId);
        if(!findSectionandDelete) {
            handleMessage(res,404,'Section with this ID not found');
        }
        console.log(cardIds);
        
        if(cardIds.length !== 0){
            await Promise.all(
                cardIds.map((cardId: string) => deleteCard(userId, cardId))
            )
        }
        handleMessage(res,200,"Section Deleted Succesfully")
    }catch(err) {
        handleError(res,err);
    }
}
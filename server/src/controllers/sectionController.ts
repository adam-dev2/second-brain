import type { Request, Response } from "express";
import { Section } from "../models/Section.js";
import { ObjectId } from "mongoose";
import Content from "../models/Content.js";


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
export const createSection = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const {name} = req.body;
    if(!name) {
        handleMessage(res,400,"Title is requried");
    }

    try{
        const newSection = new Section({name});
        await newSection.save();
        console.log(newSection.name);
        handleMessage(res,201,"New Section Created")
    }catch(err) {
        handleError(res,err)
    }
}

export const getSections = async(req:Request,res:Response) => {
    handleUserId(req,res)
    const userId = req.user?.id;
    try{
        const fetchAllSections = await Section.find({userId});
        if(fetchAllSections.length === 0) handleMessage(res,404,"no existing sections for this user");
        handleMessage(res,200,{
            message:'fetched sections successfully',
            totalSections:fetchAllSections.length,
            sections:fetchAllSections
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
    try{

    }catch(err) {
        handleError(res,err)
    }
}

export const bulkCardsMove = async(req:Request,res:Response) => {
    handleUserId(req,res)
    try{

    }catch(err) {
        handleError(res,err)
    }
}

export const fetchSectionCardsbyId = async(req:Request,res:Response) => {
    handleUserId(req,res)
    try{

    }catch(err) {
        handleError(res,err)
    }
}

export const fetchDefaultSectionCards = async(req:Request,res:Response) => {
    handleUserId(req,res)
    try{

    }catch(err) {
        handleError(res,err)
    }
}
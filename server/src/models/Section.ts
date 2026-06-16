import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ISection extends Document {
    userId:ObjectId,
    name:string,
    createdAt:Date,
    updatedAt:Date
}

const sectionSchema = new Schema<ISection>(
    {
        userId:{type:mongoose.Schema.Types.ObjectId, ref:"Users",required:true},
        name:{type:String,required:true,trim:true}
    },
    {
        timestamps:true
    }
)

export const Section = mongoose.model<ISection>("Section",sectionSchema)
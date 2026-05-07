import mongoose, { ObjectId, Schema } from "mongoose"

export interface IShare extends Document {
    userId:ObjectId,
    shareHash:string,
    sectionId?:string
}

const shareSchema = new Schema<IShare>({
    userId:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    shareHash:{type:String,required:true},
    sectionId:{type:String}
})

export const ShareModel = mongoose.model<IShare>('ShareModal',shareSchema);
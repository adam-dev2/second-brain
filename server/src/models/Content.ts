import mongoose, {Document,Schema, type ObjectId} from "mongoose";

export interface IContent extends Document {
    userId:ObjectId;
    link: string;
    title: string;
    type: string;
    tags:string[];
    share:boolean;
    embedding?:number[];
    chromaId?:string;
    createdAt:Date;
    updatedAt:Date;
} 

const contentSchema = new Schema<IContent>({
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    link: {type:String,required: true},
    title: {type:String,required: true},
    type: {type:String,required: true},
    tags: {type:[String],required: true},
    share:{type:Boolean,required:true},
    embedding:{type:[Number]},
    chromaId:{type:String},
    createdAt:{type:Date,required:true},
    updatedAt:{type:Date,required:true}
})

const Content = mongoose.model<IContent>('Content',contentSchema);

export default Content

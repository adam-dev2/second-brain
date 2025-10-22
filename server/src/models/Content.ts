import mongoose, {Document,Schema, type ObjectId} from "mongoose";

export interface IContent extends Document {
    link: string;
    title: string;
    type: string;
    tags:Number;
    userId:ObjectId;
} 

const contentSchema = new Schema<IContent>({
    link: {type:String,required: true},
    title: {type:String,required: true},
    type: {type:String,required: true},
    tags: {type:Number,required: true},
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
})

const Content = mongoose.model<IContent>('Content',contentSchema);

export default Content

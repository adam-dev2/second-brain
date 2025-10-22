import mongoose, {Document,Schema, type ObjectId} from "mongoose";

interface ITags extends Document {
    title: string,
    contentID: ObjectId,
    userID: ObjectId
}

const tagsSchema = new Schema<ITags>({
    title: {type:String,required:true},
    contentID: {type:mongoose.Schema.Types.ObjectId,ref:'Content',required:true},
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
})

const Tags = mongoose.model<ITags>('Tags',tagsSchema);

export default Tags
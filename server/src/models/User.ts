import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document {
    googleId?:string,
    githubId:string,
    username: string,
    email: string,
    password: string,
    sharelink:string,
    avatar?: string,
    updatedAt:string,
}

const userSchema = new Schema<IUser>({
    googleId:{type:String},
    githubId:{type:String},
    username:{type:String,required: true},
    email:{type:String,required: true},
    password:{type:String},  
    sharelink:{type:String},
    avatar:{type:String},
    updatedAt:{type:String}
})

const User = mongoose.model<IUser>('User',userSchema);

export default User
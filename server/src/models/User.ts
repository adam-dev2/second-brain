import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    avatar?: string
}

const userSchema = new Schema<IUser>({
    username:{type:String,required: true},
    email:{type:String,required: true},
    password:{type:String,required: true},
    avatar:{type:String}
})

const User = mongoose.model<IUser>('User',userSchema);

export default User
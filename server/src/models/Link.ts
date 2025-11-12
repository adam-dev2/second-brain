import mongoose, { Document, Schema, type ObjectId } from "mongoose";

interface ILink extends Document {
  userID: ObjectId;
  hash: string;
}

const linkSchema = new Schema<ILink>({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hash: { type: String, required: true },
});

const Link = mongoose.model<ILink>("Link", linkSchema);

export default Link;

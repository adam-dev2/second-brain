import mongoose from "mongoose";

const ConnectDB = () => {
  if (!process.env.MONGO_URI) {
    return "MISSIGN URI";
  }
  mongoose.connect(process.env.MONGO_URI);
};

export default ConnectDB;

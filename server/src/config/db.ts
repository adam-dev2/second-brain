import mongoose from "mongoose";
import dotenv from 'dotenv';

const ConnectDB = () => {
    if(!process.env.MONGO_URI) {
        return 'MISSIGN URI'
    }
    mongoose.connect(process.env.MONGO_URI)
    
}

export default ConnectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url= process.env.DB_URL;

const connectToMongoDB= async ()=>{
    try {
        await mongoose.connect(url)
        console.log("connected to mongodb");
    } catch (error) {
        console.log("error in connecting mongodb",error);
    }
}

export default connectToMongoDB;
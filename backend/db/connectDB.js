import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
           const connection= await mongoose.connect(`${process.env.MONGO_URI}/auth`)
           console.log(`MongoDB Connected: ${connection.connection.host}`);
           
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
}
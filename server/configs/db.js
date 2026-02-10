import  mongoose from "mongoose";


const connectDB = async()=>{
    try {
        mongoose.connection.once("connected", ()=>{
            console.log("database connected successfully")
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/restaurant`)
    } catch (error) {
        console.error("Databse connection error", error.mesasge)
    }
}

export default connectDB;
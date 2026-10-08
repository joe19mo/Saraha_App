import mongoose from "mongoose";

export default async  function ConnectionDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/saraha_test", { serverSelectionTimeoutMS:5000 })
        console.log("database connected .....");
        
    } catch (error) {
        console.log("datbase connection failed :(");
    }
} 
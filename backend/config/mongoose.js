import mongoose from "mongoose";

async function mongooseConnect(){
    try{
        await mongoose.connect(process.env.MONGODB_URI+"/PeriodTracker");
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log("Error connecting to MongoDB",error.message);
    }
}

process.on("SIGINT",async()=>{
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
})
export default mongooseConnect;
import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
    totalSpending:Number,
    jobs:[{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"}],
    rating:Number,
    client:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
    profileImage:String
    
})
export default mongoose.model("clientProfiles",clientProfileSchema);
import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
    totalSpending:Number,
    jobs:Number,
    profileImage: String,
    rating:Number,
    client:{type:mongoose.Schema.Types.ObjectId , ref :"User"}
})
export default mongoose.model("clientprofiles",clientProfileSchema);
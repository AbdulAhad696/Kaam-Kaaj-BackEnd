import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
    totalSpending:Number,
    jobs:[{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"}],
    profileImage: String,
    rating:Number,
    client:{type:mongoose.Schema.Types.ObjectId , ref :"User"}
})
export default mongoose.model("clientProfiles",clientProfileSchema);
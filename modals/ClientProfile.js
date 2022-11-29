import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
    totalSpending:Number,
    jobs:[{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"}],
    rating:Number,
})
export default mongoose.model("clientProfile",clientProfileSchema);
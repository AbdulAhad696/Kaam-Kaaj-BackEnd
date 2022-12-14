import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    job:[{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"}],
    review:String,
    reviewTo: {type:mongoose.Schema.Types.ObjectId , ref :"User"},
    reviewDate:Date
})
export default mongoose.model("review",reviewSchema);
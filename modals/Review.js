import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    job:[{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"}],
    review:String,
    reviewDate:Date
})
export default mongoose.model("review",reviewSchema);
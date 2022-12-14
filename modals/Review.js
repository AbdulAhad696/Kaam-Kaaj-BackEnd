import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
    review: String,
    reviewDate: Date,
    reviewTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})
export default mongoose.model("review", reviewSchema);
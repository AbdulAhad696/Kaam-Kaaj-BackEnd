import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    title: String,
    jobPostDate: Date,
    description: String,
    estAmount: Number,
    clientRating: Number,
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bids" }],
    gigPics: [],
    spRating: Number,
    status: String,
    jobAddress: String,
    estCompletionTime: Date,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Services" },
    jobAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptedBid: { type: mongoose.Schema.Types.ObjectId, ref: "Bids" }
})
export default mongoose.model("jobs", jobsSchema)
import mongoose from "mongoose";
const serviceProviderSchema = new mongoose.Schema({
    serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Services" },
    profilePicture: String,
    portfolioImages: [],
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
    status: String,
    rating: Number,
    experience: Number,
    jobsCompleted: Number,
    totalEarnings: Number,
    bids: [],
    balance: Number
});

export default mongoose.model("serviceproviders", serviceProviderSchema)
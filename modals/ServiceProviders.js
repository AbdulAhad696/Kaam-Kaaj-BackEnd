import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
    userName: String,
    rating: Number,
    service: String,
    address: String,
    totalEarning:Number,
    experience: Number,
    jobsCompleted: Number,
    images:[],
    profilePicture: String
});

export default mongoose.model("serviceproviders",serviceProviderSchema)
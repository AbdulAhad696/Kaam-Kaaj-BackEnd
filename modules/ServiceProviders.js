import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
    username: String,
    rating: Number,
    service: String,
    address: String,
    totalEarning:Number,
    experience: Number,
    jobsCompleted: Number,
    images:[]
});

export default mongoose.model("serviceproviders",serviceProviderSchema)
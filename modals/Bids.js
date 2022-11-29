import mongoose from "mongoose";

const bidsSchema = new mongoose.Schema({
    duration:String,
    amount:Number,
    email:String
})
export default mongoose.model("bids",bidsSchema);
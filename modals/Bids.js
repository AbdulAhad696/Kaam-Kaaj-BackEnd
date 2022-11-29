import mongoose from "mongoose";

const bidsSchema = new mongoose.Schema({
    duration:Number,
    amount:Number,
    email:String ,
    jobId:{type:mongoose.Schema.Types.ObjectId , ref :"Jobs"},
    status:String,

})
export default mongoose.model("bids",bidsSchema);
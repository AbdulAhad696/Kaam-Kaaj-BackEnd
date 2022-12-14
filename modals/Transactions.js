import mongoose from "mongoose";

const TransactionsSchema = new mongoose.Schema({
    from:{type:mongoose.Schema.Types.ObjectId , ref :"User"},
    to: String,
    amount:Number,
    timeStamp:Date,
    reason:String
})
export default mongoose.model("transaction",TransactionsSchema);
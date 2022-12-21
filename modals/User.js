import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    cnic: String,
    phoneNumber: String,
    address: String,
    role: String,
    authentication: String,
    location: Object,
    balance: Number,
    totalEarning: Number
});
export default mongoose.model("users", userSchema);

import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    cnic:String,
    phoneNumber:String,
    address:String,
    role:String
});
export default mongoose.model("users",userSchema);

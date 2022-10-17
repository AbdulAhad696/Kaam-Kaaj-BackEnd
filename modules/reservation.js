import mongoose from "mongoose";

const reservationSchema=new mongoose.Schema({
    name:String,
    email:String,
    phoneNumber:String,
    message:String,
    usertype:String
});
export default mongoose.model("reservations",reservationSchema);
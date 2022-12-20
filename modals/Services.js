import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    tittle: String,
    image: String,
    rating: Number
});

export default mongoose.model("services",serviceSchema)
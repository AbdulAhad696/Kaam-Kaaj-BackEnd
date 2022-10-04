// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/route.js"
import signUp from "./routes/signUp.js"
//App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = "mongodb+srv://kaamkaaj:kaamkaaj123@semesterproject.g48g12p.mongodb.net/?retryWrites=true&w=majority";

//MiddleWares
app.use(express.json());
app.use(cors());
//DB CONFIG
mongoose.connect(connection_url)

//Routes
app.use("/" , routes)
app.use("/signup",signUp)

//Testing Endpoint
app.get("/" , (req , res)=>{
    res.status(200).send("HELLO KAAM KAAJ!!!");
})
// Listener
app.listen(port , ()=>console.log(`LISTENING TO PORT ${port}`))




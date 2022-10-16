// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/route.js"
import signUp from "./routes/signUp.js"
import signin from "./routes/signin.js"
import customerView from "./routes/customerView.js";
import categoryWiseServiceProvider from "./routes/categoryWiseServiceProvider.js";

//App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url = "mongodb+srv://kaamkaaj:kaamkaaj123@semesterproject.g48g12p.mongodb.net/KaamKaaj?retryWrites=true&w=majority";

//MiddleWares
app.use(express.json());
app.use(cors());
//DB CONFIG
mongoose.connect(connection_url)
mongoose.connection.on("connected" , ()=>{
    console.log("CONNECTED TO DATABASE")
})


//Routes
app.use("/" , routes)
app.use("/signup",signUp)
app.use("/signin",signin)
app.use("/services",customerView)
app.use("/serviceproviders",categoryWiseServiceProvider )

//Testing Endpoint
app.get("/" , (req , res)=>{
    res.status(200).send("HELLO KAAM KAAJ!!!");
})


// Listener
app.listen(port , ()=>console.log(`LISTENING TO PORT ${port}`))




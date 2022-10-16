// Imports
import express from "express";
import cors from "cors";
import mongoose from './dbconnect.js'
import routes from "./routes/route.js"
import signUp from "./routes/signUp.js"
import signin from "./routes/signin.js"
import complain from "./routes/complain.js"
//App Config
const app = express();
const port = process.env.PORT || 8001;


//MiddleWares
app.use(express.json());
app.use(cors());

//Routes
app.use("/" , routes);
app.use("/signup",signUp);
app.use("/signin",signin);
app.use("/contactus",complain);


// Listener
app.listen(port , ()=>console.log(`LISTENING TO PORT ${port}`));




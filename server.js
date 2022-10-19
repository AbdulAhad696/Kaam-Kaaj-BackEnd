// Imports
import express from "express";
import cors from "cors";
import mongoose from './dbconnect.js'
import routes from "./routes/route.js"
import signUp from "./routes/signUp.js"
import signin from "./routes/signin.js"
import customerView from "./routes/customerView.js";
import categoryWiseServiceProvider from "./routes/categoryWiseServiceProvider.js";
import serviceProviderProfile from "./routes/serviceProviderProfile.js"

import complain from "./routes/complain.js"
//App Config
const app = express();
const port = process.env.PORT || 8001;


//MiddleWares
app.use(express.json());
app.use(cors());

//Routes
app.use("/" , routes)
app.use("/signup",signUp)
app.use("/signin",signin)
app.use("/services",customerView)
app.use("/serviceproviders",categoryWiseServiceProvider )
app.use("/contactus",complain)
app.use("/serviceprovider/profile",serviceProviderProfile);


// Listener
app.listen(port , ()=>console.log(`LISTENING TO PORT ${port}`));




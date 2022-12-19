// Imports
import express from "express";
import cors from "cors";
import mongoose from './dbconnect.js'
import routes from "./routes/route.js"
import signUp from "./routes/signUp.js"
import signin from "./routes/signin.js"
import customerView from "./routes/customerView.js";
import categoryWiseServiceProvider from "./routes/categoryWiseServiceProvider.js";
import viewjobs from "./routes/viewjobs.js"
import complain from "./routes/complain.js";
import addingJobs from "./routes/addJobs.js";
import serviceProviderProfile from "./routes/serviceProviderProfile.js"
import serviceProviderDetails from "./routes/serviceProviderDetails.js"
import serviceProviderProjects from "./routes/serviceProviderProjects.js"
import viewingBids from "./routes/bidsView.js"
import customerPage from "./routes/customerPage.js"
import clientDetails from "./routes/clientDetails.js"
import clientProjects from "./routes/clientProjects.js"
import sendMail from "./routes/sendMail.js"
import acceptBid from "./routes/acceptBid.js"
import changePassword from "./routes/changePassword.js";
import doneProjects from "./routes/SpDoneProjects.js";
import transactions from "./routes/transactions.js"
import allComplaints from "./routes/viewComplaints.js";
import clientDoneProject from "./routes/clientDoneProject.js"


//App Config
const app = express();
const port = process.env.PORT || 8001;

//MiddleWares
app.use(express.json());
app.use(cors());



// app.use("/uploads", express.static("uploads"))
// app.use("/JobGigPics", express.static("JobGigPics"))
// app.use("/contactUsPics", express.static("contactUsPics"))

app.use("/Images", express.static("Images"))
// app.use("/Images/ProfilePics", express.static("ProfilePics"))
// app.use("/Images/JobGigPics", express.static("JobGigPics"))
// app.use("/Images/PortfolioPics", express.static("PortfolioPics"))


//Routes
app.use("/", routes)
app.use("/signup", signUp)
app.use("/signin", signin)
app.use("/services", customerView)
app.use("/serviceproviders", categoryWiseServiceProvider)
app.use("/contactus", complain);
app.use("/service-provider/viewjobs", viewjobs)
app.use("/addJobs", addingJobs)
app.use("/serviceprovider/profile", serviceProviderProfile);
app.use("/serviceprovider/mydetails", serviceProviderDetails)
app.use("/client/mydetails", clientDetails)
app.use("/serviceprovider/projects", serviceProviderProjects)
app.use("/client/projects", clientProjects)
app.use("/bids", viewingBids);
app.use("/customer-mainpage", customerPage);
app.use("/sendmail", sendMail)
app.use("/transactions", transactions)
app.use("/changepassword", changePassword)
app.use("/acceptbid", acceptBid)
app.use("/serviceProvider/doneProject", doneProjects)
app.use("/complaints",allComplaints)
app.use("/client/doneProject",clientDoneProject)



// Listener
app.listen(port, () => console.log(`LISTENING TO PORT ${port}`));




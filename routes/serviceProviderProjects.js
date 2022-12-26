import express from "express";
// import User from "../modals/User.js"
import ServiceProviders from "../modals/ServiceProviders.js";
import Jobs from "../modals/Jobs.js";
import mongoose from 'mongoose'


const router = express.Router()
// var mongoose = require('mongoose');
var currentProjects
// var totalDoneJobs
// var totalDoneJobsInDueDate
// var totalRejectedJobs
router.get("/:_id" , async(req , res)=>{
    console.log("Request is received for getting the projectss of "+req.params._id)

            // const querryForDoneJobsOnTime=Jobs.find( {jobAssignedTo:data[0].serviceProviderDetails[0]._id,jobDoneStatus:"early"} );


    // try{
    //     currentProjects=await Jobs.find( {jobAssignedTo:req.params._id,status:"inProgress"} );
    // }
    // catch(err){
    //     console.log(err);
    // }

    Jobs.aggregate([
        { $lookup:
            {
                from:'users',
                localField:'jobAssignedBy',
                foreignField:'_id',
                as:'clientDetails'
            }

        },
        {
            $lookup:{
                from: "clientprofiles", 
                localField: "jobAssignedBy", 
                foreignField: "client",
                as: "clientProfile"
            }
        },
        {
            $lookup:{
                from: "bids", 
                localField: "acceptedBid", 
                foreignField: "_id",
                as: "bidDetails"
            }
        },
        {
            $match:{
                $or:[{"jobAssignedTo":mongoose.Types.ObjectId(req.params._id),"status":"inProgress"},{"jobAssignedTo":mongoose.Types.ObjectId(req.params._id),"status":"doneByClient"} ,{"jobAssignedTo":mongoose.Types.ObjectId(req.params._id),"status":"jobCompleted"} ]
            }
        }, 
        
    ]).exec(async (err , data)=>{
        if(err){
            console.log("Error in retreiving projects..........")
        }
        else{
            res.json(data)
        }
    })
    

})

export default router;
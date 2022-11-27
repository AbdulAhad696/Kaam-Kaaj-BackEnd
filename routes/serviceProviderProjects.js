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
                from: "clientProfiles", 
                localField: "jobAssignedBy", 
                foreignField: "client",
                as: "clientProfile"
            }
        },
        {
            $lookup:{
                from: "bids", 
                localField: "bid", 
                foreignField: "_id",
                as: "bidDetails"
            }
        },
        {
            $match:{
                $and:[{"jobAssignedTo":mongoose.Types.ObjectId(req.params._id),"status":"inProgress"}]
            }
        }, 
        
    ]).exec(async (err , data)=>{
        if(err){
            console.log("Error in retreiving projects..........")
        }
        else{
            // console.log(data[0].serviceProviderDetails[0]._id)
            // const querryForTotalJobs=Jobs.find({jobAssignedTo:data[0].serviceProviderDetails[0]._id})
            // const querryForDoneJobs=Jobs.find({jobAssignedTo:data[0].serviceProviderDetails[0]._id,status:"done"})
            // const querryForDoneJobsOnTime=Jobs.find( {jobAssignedTo:data[0].serviceProviderDetails[0]._id,jobDoneStatus:"early"} );
            // const querryForRejectedJobs=Jobs.find({jobAssignedTo:data[0].serviceProviderDetails[0]._id,status:"reject"})
            
            // totalJobs= await querryForTotalJobs.count()
            // totalDoneJobs= await querryForDoneJobs.count()
            // totalDoneJobsInDueDate=await querryForDoneJobsOnTime.count()
            // totalRejectedJobs=await querryForRejectedJobs.count()

            // data[0].orderCompletion=(totalDoneJobs/totalJobs)*100
            // data[0].deliverOnTime=(totalDoneJobsInDueDate/totalDoneJobs)*100
            // data[0].responseRate=(100-(totalRejectedJobs/totalJobs)*100)


            res.json(data)
        }
    })
    

})

export default router;
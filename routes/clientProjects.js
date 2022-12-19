import express from "express";
import Jobs from "../modals/Jobs.js";
import mongoose from 'mongoose'


const router = express.Router()
// var mongoose = require('mongoose');
var currentProjects
router.get("/:_id" , async(req , res)=>{
    console.log("Request is received for getting the projects of "+req.params._id)
    Jobs.aggregate([
        { $lookup:
            {
                from:'users',
                localField:'jobAssignedTo',
                foreignField:'_id',
                as:'serviceProviderDetails'
            }

        },
        {
            $lookup:{
                from: "serviceproviders", 
                localField: "jobAssignedTo", 
                foreignField: "serviceProvider",
                as: "serviceProviderProfile"
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
                $and:[{"jobAssignedBy":mongoose.Types.ObjectId(req.params._id),"status": "inProgress"}]
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
import  express  from "express";
import Jobs from "../modals/Jobs.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/jobs/:userId",(req,res)=>{
    console.log(req.params.userId)
    Jobs.aggregate([
        {
            $lookup:{
                from:"services",
                localField: "category",
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        
        {
            $lookup:{
                from:"clientprofiles",
                localField:"jobAssignedBy",
                foreignField:"client",
                as:"clientDetails"
            }
        },
        {   
            $match:
            {
                $and:[{"clientDetails.client":mongoose.Types.ObjectId(req.params.userId)}]
            }
        }
    ]).exec(function(err,data){
        if(err){
            console.log("error")
        }
        else{
            res.json(data)
            console.log("Jobs Sent")
        }
    })
});

export default router;
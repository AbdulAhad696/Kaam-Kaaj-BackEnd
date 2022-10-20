import  express from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
import jobs from "../modals/Jobs.js"

const router = express.Router();

router.get("/:email",(req,res)=>{

    ServiceProviders.aggregate([
        {
            $lookup:
            {
                from :"users",
                localField:"serviceProvider",
                foreignField:"_id",
                as:"userDetails"
            }
        },
        {   $lookup:
            {
                from: "services",
                localField: "serviceCategory",
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        
        {
            $match:{
                $and:[{"userDetails.email":req.params.email}]
            }
        }
    ]).exec(function(err,data){
        if (err){
            console.log("Error in retreiving")
        }
        else{
            res.json(data)
        }
    })
})
router.get("/categoryjobs/:cat",(req,res)=>{
    jobs.aggregate([
        {
            $lookup:
            {
                from: "services",
                localField: "category",
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        {   
            $match:
            {
                $and:[{"serviceDetails.tittle":req.params.cat}]
            }
        }

    ]).exec(function(err,data){
        if(err){
            console.log("error")
        }
        else{
            res.json(data)
        }
    })
})

export default router
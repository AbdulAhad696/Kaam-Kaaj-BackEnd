import  express from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
import jobs from "../modals/Jobs.js"
import Jobs from "../modals/Jobs.js";
import Bids from "../modals/Bids.js";

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
            console.log("Category Sent")
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
                $and:[{"serviceDetails.tittle":req.params.cat}]
            }
        }

    ]).exec(function(err,data){
        if(err){
            console.log("error")
        }
        else{
            res.json(data)
            console.log("Jobs by Category Sent")
        }
    })
})
router.patch("/",async (req,resq)=>{
    let object = {
        duration:req.body.duration,
        amount:req.body.amount,
        email:req.body.email,
        jobId:req.body.id,
        status:"pending"
    }
    let bidbysp = new Bids(object);
    console.log(req.body.id)
    console.log(object.amount,object.duration,object.email)
    await bidbysp.save().then(async(res)=>{
        let bidId = res._id
        const query = {_id:req.body.id}
        const updatedoc = {$push:{"bids":bidId}}
        await Jobs.updateOne(query,updatedoc).then(doc=>{
            resq.send(doc)
        })

    }).catch((erro)=>{
        console.log(erro)
        resq.send(erro)
    })
    
})

export default router
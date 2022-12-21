import  express from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
import jobs from "../modals/Jobs.js"
import Jobs from "../modals/Jobs.js";
import Bids from "../modals/Bids.js";
import mongoose from "mongoose";

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
router.get("/categoryjobs/:cat/:id",(req,res)=>{
    console.log(req.params.id)
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
                $and:[{"serviceDetails.tittle":req.params.cat},{status:"punched"},{$or:[{jobAssignedTo:null},{jobAssignedTo:mongoose.Types.ObjectId(req.params.id) }]}    
                    ]
            }
        }

    ]).exec(function(err,data){
        if(err){
            console.log("error")
        }
        else{
            res.json(data)
            console.log("Jobs by Category Sent",data)
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
    let bidExist = await Bids.find({email:req.body.email,jobId:req.body.jobId})
    if(bidExist){
        const query = {email:req.body.email}
        const updatedoc = {$set:{"amount":req.body.amount,"duration":req.body.duration}}
        await Bids.updateOne(query,updatedoc).then(doc=>{
            resq.send(doc)
        }).catch((erro)=>{
            console.log(erro)
            resq.send(erro)
        })
    }
    else{
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
    }
})

export default router
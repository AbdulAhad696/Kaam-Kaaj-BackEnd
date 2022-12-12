import express from "express";
import Bids from "../modals/Bids.js"
import Jobs from "../modals/Jobs.js";




const router = express.Router()


router.patch("/:id/:userId" , async(req , res)=>{
    console.log("Request is received for accepting the bid:",req.params.id)

    Bids.findOneAndUpdate({_id: req.params.id },req.body).then((result)=>{
        Jobs.findOneAndUpdate({_id:result.jobId},{status:"inProgress",acceptedBid:result._id,jobAssignedTo:req.params.userId}).then((data)=>{
            res.send(data)
        })
    })
})

export default router;
import express from "express";
import Job from "../modals/Jobs.js";
import mongoose from "mongoose";
import Bids from "../modals/Bids.js"

// ------join of bids, users and serviceProviders tables in order to get biding data---------------
const router = express.Router()
router.get("/:id", (req, res) => {
    console.log("getting bids gata..............")
    Bids.aggregate([
        {
            $lookup:
            {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'jobDetails'
            }
        }
        ,
        { $lookup:
            {
                from:'users',
                localField:'email',
                foreignField:'email',
                as:'userDetails'
            }
        },
        { $lookup:
            {
                from:'serviceproviders',
                localField: "userDetails._id",
                foreignField:'serviceProvider',
                as:'serviveProviderDetails'
            }
        },
        {
            $match: {
                $and: [{ "jobId": mongoose.Types.ObjectId(req.params.id),"status":"pending" }]
            }
        }
    ]).exec(function (err, bidData) {
        if (err) {
            console.log("Error in retreiving serices..........")
        }
        else {
            res.json(bidData)
        }
    })
})


router.patch("/:id",(req,res)=>{
    console.log("Request is received for changing the status of the bid:",req.params.id)

    Bids.findOneAndUpdate({_id: req.params.id },req.body).then((result)=>{
        console.log(result)
        res.send(result)
    })

})


export default router;
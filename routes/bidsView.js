import express from "express";
import Job from "../modals/Jobs.js";
import mongoose from "mongoose";

// ------join of bids, users and serviceProviders tables in order to get biding data---------------
const router = express.Router()
router.get("/:id", (req, res) => {
    console.log("getting bids gata..............")
    Job.aggregate([
        {
            $lookup:
            {
                from: 'bids',
                localField: 'bids',
                foreignField: '_id',
                as: 'bidsDetails'
            }
        }
        ,
        { $lookup:
            {
                from:'users',
                localField:'bidsDetails.email',
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
        }
        ,
        { $lookup:
            {
                from:'services',
                localField: "category",
                foreignField:'_id',
                as:'serviveDetails'
            }
        }
        ,
        {
            $match: {
                $and: [{ "_id": mongoose.Types.ObjectId(req.params.id) }]
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
export default router;
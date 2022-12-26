import express from "express";
// import User from "../modals/User.js"
import ServiceProviders from "../modals/ServiceProviders.js";
import Jobs from "../modals/Jobs.js";


const router = express.Router()
var totalJobs
var totalDoneJobs
var totalDoneJobsInDueDate
var totalRejectedJobs
router.get("/:email", async (req, res) => {
    console.log("Request is received for getting the details of " + req.params.email)

    ServiceProviders.aggregate([
        {
            $lookup:
            {
                from: 'users',
                localField: 'serviceProvider',
                foreignField: '_id',
                as: 'serviceProviderDetails'
            }

        },
        {
            $lookup: {
                from: "services",
                localField: "serviceCategory",
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        {
            $match: {
                $and: [{ "serviceProviderDetails.email": req.params.email }]
            }
        },

    ]).exec(async (err, data) => {
        if (err) {
            console.log("Error in retreiving serices..........")
        }
        else {
            console.log(data)
            console.log(data[0]?.serviceProviderDetails[0]._id)
            const querryForTotalJobs = Jobs.find({ jobAssignedTo: data[0].serviceProviderDetails[0]._id })
            const querryForDoneJobs = Jobs.find({ jobAssignedTo: data[0].serviceProviderDetails[0]._id, status: "done" })
            const querryForDoneJobsOnTime = Jobs.find({ jobAssignedTo: data[0].serviceProviderDetails[0]._id, jobDoneStatus: "early" });
            const querryForRejectedJobs = Jobs.find({ jobAssignedTo: data[0].serviceProviderDetails[0]._id, status: "reject" })

            totalJobs = await querryForTotalJobs.count()
            totalDoneJobs = await querryForDoneJobs.count()
            totalDoneJobsInDueDate = await querryForDoneJobsOnTime.count()
            totalRejectedJobs = await querryForRejectedJobs.count()

            data[0].orderCompletion = ((totalDoneJobs / totalJobs) * 100).toFixed(2)
            data[0].deliverOnTime = ((totalDoneJobsInDueDate / totalDoneJobs) * 100).toFixed(2)
            data[0].responseRate = ((100 - (totalRejectedJobs / totalJobs) * 100)).toFixed(2)

            res.json(data)
        }
    })


})

export default router;
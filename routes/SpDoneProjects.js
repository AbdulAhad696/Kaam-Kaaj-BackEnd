import express from "express";
import Job from "../modals/Jobs.js";
import serviceProvider from "../modals/ServiceProviders.js";
import Review from "../modals/Review.js";
import mongoose from "mongoose";

import client from "../modals/ClientProfile.js";

const router = express.Router();

router.patch("/:jobId", function (req, res) {
    console.log("Kashir request received")
    Job.findById(req.params.jobId).then((specificJob) => {
        serviceProvider.find({ serviceProvider: specificJob.jobAssignedTo }).then((specificServiceProvider) => {
            const newJobsCompleted = specificServiceProvider[0].jobsCompleted + 1;
            const newTotalEarning = specificServiceProvider[0].totalEarning + req.body.earning
            client.findOne({ client: specificJob.jobAssignedBy }).then((specificClient)=>{
                const newRating = (specificClient.rating + req.body.rating)/2
                client.findOneAndUpdate({  client: specificJob.jobAssignedBy } ,{ rating: newRating } ).then((updatedClient)=>{
                    var newStatus = 'doneByWorker';
                    if(specificJob.status == 'inProgress'){
                        newStatus = 'doneByWorker';
                    }
                    else if(specificJob.status == 'doneByClient'){
                        newStatus = 'jobCompleted'
                    }
                    Job.findByIdAndUpdate({_id: req.params.jobId}, {status: newStatus}).then((updatedJob)=>{
                        serviceProvider.findOneAndUpdate({ serviceProvider: specificJob.jobAssignedTo }, {  jobsCompleted: newJobsCompleted, totalEarning: newTotalEarning }).then((updatedServiceProvider) => {
                            let currentDate = new Date()
                            let review = new Review({
                                job: specificJob._id,
                                review: req.body.review,
                                reviewTo: specificServiceProvider[0].serviceProvider,
                                reviewDate: currentDate
                            })
                            let isReviewAdded;
                            isReviewAdded = review.save().then((err, res) => {
                                if (err.body) {
                                    console.log("Failed to add review");
                                    return false;
                                }
                                else {
                                    console.log("review added successfully");
                                    return true;
                                }
                            })
                            res.send(specificServiceProvider);
                        })
                    })
                })
            })
        })
    })
});


export default router;
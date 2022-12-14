import express from "express";
import Job from "../modals/Jobs.js";
import serviceProvider from "../modals/ServiceProviders.js";
import Review from "../modals/Review.js";
import mongoose from "mongoose";

const router = express.Router();

router.patch("/:jobId", function (req, res) {
    Job.findById(req.params.jobId).then((specificJob) => {
        serviceProvider.find({ serviceProvider: specificJob.jobAssignedTo }).then((specificServiceProvider) => {
            const newRating = (specificServiceProvider[0].rating + req.body.rating) / 2
            const newJobsCompleted = specificServiceProvider[0].jobsCompleted + 1;
            const newTotalEarning = specificServiceProvider[0].totalEarning + req.body.earning
            serviceProvider.findOneAndUpdate({ serviceProvider: specificJob.jobAssignedTo }, { rating: newRating, jobsCompleted: newJobsCompleted, totalEarning: newTotalEarning }).then((updatedServiceProvider) => {
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
});


export default router;
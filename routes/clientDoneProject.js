import express from "express";
import Job from "../modals/Jobs.js";
import serviceProvider from "../modals/ServiceProviders.js";
import Review from "../modals/Review.js";
import mongoose from "mongoose";
import ClientProfile from "../modals/ClientProfile.js";
import service from "../modals/Services.js";

const router = express.Router();

router.patch("/:jobId",   (req, res)=> {
    console.log("Project done by client")
    Job.findById(req.params.jobId).then((specificJob) => {
        ClientProfile.find({ client: specificJob.jobAssignedBy }).then((specificClient) => {
            const newJobsCompleted = specificClient[0].jobs+1;
            const totalSpending = specificClient[0].totalSpending + req.body.earning
            serviceProvider.findOne({ serviceProvider: specificJob.jobAssignedTo }).then((specificServiceProvider)=>{
                
                
                const newRating = ((specificServiceProvider.rating + req.body.rating) / 2).toFixed(2)




                serviceProvider.findOneAndUpdate({ serviceProvider: specificJob.jobAssignedTo },{ rating: newRating }).then((updatedServiceProvider)=>{                    
                    // ---------------updating service rating-----------------
                    var newServiceRating = 0;
                    serviceProvider.find({ serviceCategory: specificServiceProvider?.serviceCategory }).then((ServiceProvidersOfSpecificCaregory)=>{
                        for(let i = 0 ; i < ServiceProvidersOfSpecificCaregory.length; i++){
                            newServiceRating = newServiceRating + ServiceProvidersOfSpecificCaregory[i].rating
                        }
                        newServiceRating = (newServiceRating/ServiceProvidersOfSpecificCaregory.length).toFixed(2)
                        service.findByIdAndUpdate({_id:specificServiceProvider?.serviceCategory},{rating: newServiceRating}).then((updatedService)=>{
                            var newStatus = 'doneByClient';
                            if(specificJob.status == 'inProgress'){
                                newStatus = 'doneByClient';
                            }
                            else if(specificJob.status == 'doneByWorker'){
                                newStatus = 'jobCompleted'
                                
                            }
                            Job.findByIdAndUpdate({_id: req.params.jobId}, {status: newStatus}).then((updatedJob)=>{
                                ClientProfile.findOneAndUpdate({ client: specificJob.jobAssignedBy }, {  jobs: newJobsCompleted, totalSpending: totalSpending }).then((updatedServiceProvider) => {
                                    let currentDate = new Date()
                                    let review = new Review({
                                        job: specificJob._id,
                                        review: req.body.review,
                                        reviewTo: specificClient[0].client,
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
                                    res.send(specificClient);
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});


export default router;